import { LlmRequestOptions, LlmResponse } from './adapter';

export async function callOllama(options: LlmRequestOptions): Promise<LlmResponse | null> {
  const baseUrl = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';

  const response = await fetch(`${baseUrl}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'llama3',
      stream: false,
      messages: [
        { role: 'system', content: options.systemPrompt },
        { role: 'user', content: options.userMessage },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`Ollama connection error: ${response.status}`);
  }

  const data = await response.json();
  return {
    content: data.message?.content || '',
    providerUsed: 'ollama',
  };
}
