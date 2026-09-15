export interface DocumentChunk {
  content: string;
  chunkIndex: number;
  metadata?: Record<string, any>;
}

/**
 * Sanitizes and splits raw text into semantic chunks for vector storage
 */
export function chunkText(
  rawText: string,
  chunkSize: number = 1000,
  overlap: number = 150
): DocumentChunk[] {
  // 1. Sanitize text: remove non-printable characters & dangerous prompt injection delimiters
  const sanitized = sanitizeDocumentContent(rawText);

  // If text is short, return as a single chunk
  if (sanitized.length <= chunkSize) {
    return [{ content: sanitized, chunkIndex: 0 }];
  }

  const chunks: DocumentChunk[] = [];
  let startIndex = 0;
  let chunkIndex = 0;

  while (startIndex < sanitized.length) {
    let endIndex = startIndex + chunkSize;

    if (endIndex < sanitized.length) {
      // Try to break at sentence or paragraph boundary
      const boundaryMatch = sanitized.slice(startIndex, endIndex).lastIndexOf('. ');
      const newlineMatch = sanitized.slice(startIndex, endIndex).lastIndexOf('\n');
      const breakPoint = Math.max(boundaryMatch, newlineMatch);

      if (breakPoint > chunkSize * 0.5) {
        endIndex = startIndex + breakPoint + 1;
      }
    } else {
      endIndex = sanitized.length;
    }

    const chunkStr = sanitized.slice(startIndex, endIndex).trim();
    if (chunkStr.length > 20) {
      chunks.push({
        content: chunkStr,
        chunkIndex,
      });
      chunkIndex++;
    }

    startIndex = endIndex - overlap;
    if (startIndex >= sanitized.length - overlap) {
      break;
    }
  }

  return chunks;
}

/**
 * Sanitizes document content to prevent prompt injection and encoding issues
 */
export function sanitizeDocumentContent(text: string): string {
  return text
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '') // strip control chars
    .replace(/\[SYSTEM\]/gi, '[Doc Note]') // neutralize system override tokens
    .replace(/IGNORE ALL PREVIOUS INSTRUCTIONS/gi, '[Redacted instruction]')
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // strip scripts
    .trim();
}
