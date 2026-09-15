/**
 * Embeddings Generator for BizOS RAG Knowledge Base.
 * Default: Google Gemini `text-embedding-004` (768-dimensional, generous free tier)
 * Fallback: Deterministic 768-dimensional semantic hash vector for offline/zero-key demos.
 */

export async function generateEmbedding(text: string): Promise<number[]> {
  const geminiApiKey = process.env.GEMINI_API_KEY;

  if (geminiApiKey) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key=${geminiApiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: 'models/text-embedding-004',
            content: {
              parts: [{ text: text.slice(0, 8000) }], // limit to ~8k chars per chunk
            },
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        const values = data.embedding?.values;
        if (Array.isArray(values) && values.length === 768) {
          return values;
        }
      } else {
        const errText = await response.text();
        console.warn('Gemini embedding API non-OK response:', errText);
      }
    } catch (err) {
      console.warn('Error calling Gemini text-embedding-004:', err);
    }
  }

  // Fallback: Deterministic normalized 768-dimensional vector
  return generateDeterministicEmbedding(text, 768);
}

/**
 * Generate batch embeddings in small chunks to respect serverless timeouts & rate limits
 */
export async function generateBatchEmbeddings(texts: string[]): Promise<number[][]> {
  const results: number[][] = [];
  // Batch in chunks of 5
  for (let i = 0; i < texts.length; i += 5) {
    const chunk = texts.slice(i, i + 5);
    const chunkEmbeddings = await Promise.all(chunk.map((t) => generateEmbedding(t)));
    results.push(...chunkEmbeddings);
  }
  return results;
}

/**
 * Deterministic pseudo-semantic vector generator for zero-config offline testing.
 * Uses character frequency and trigram hashing normalized to unit length.
 */
function generateDeterministicEmbedding(text: string, dimensions: number = 768): number[] {
  const vec = new Array(dimensions).fill(0);
  const clean = text.toLowerCase();

  for (let i = 0; i < clean.length - 2; i++) {
    const tri = clean.charCodeAt(i) * 31 + clean.charCodeAt(i + 1) * 17 + clean.charCodeAt(i + 2);
    const idx = Math.abs(tri) % dimensions;
    vec[idx] += 1;
  }

  // Normalize to unit vector (L2 norm) for cosine distance
  let norm = 0;
  for (let i = 0; i < dimensions; i++) {
    norm += vec[i] * vec[i];
  }
  norm = Math.sqrt(norm);
  if (norm > 0) {
    for (let i = 0; i < dimensions; i++) {
      vec[i] = vec[i] / norm;
    }
  } else {
    vec[0] = 1;
  }

  return vec;
}
