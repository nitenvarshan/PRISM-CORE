import { callGroq } from './groq';
import { callGemini } from './gemini';
import { callOllama } from './ollama';
import { callMockLlm } from './mockLlm';
import { ToolDefinition } from '../rag/tools';

export interface LlmRequestOptions {
  systemPrompt: string;
  userMessage: string;
  tools?: ToolDefinition[];
  temperature?: number;
}

export interface LlmToolCall {
  name: string;
  arguments: Record<string, any>;
}

export interface LlmResponse {
  content: string;
  toolCalls?: LlmToolCall[];
  providerUsed: 'groq' | 'gemini' | 'ollama' | 'mock';
}

/**
 * Unified LLM Adapter function.
 * Prioritizes:
 * 1. Groq (if GROQ_API_KEY is present) - ultra fast for live deployed demo
 * 2. Gemini (if GEMINI_API_KEY is present)
 * 3. Ollama (if OLLAMA_BASE_URL is reachable)
 * 4. Grounded intelligent mock responder (100% reliable offline fallback)
 */
export async function callLlm(options: LlmRequestOptions): Promise<LlmResponse> {
  // Option 1: Groq API
  if (process.env.GROQ_API_KEY && process.env.GROQ_API_KEY.startsWith('gsk_')) {
    try {
      const res = await callGroq(options);
      if (res) return res;
    } catch (err) {
      console.warn('Groq provider error, trying next fallback:', err);
    }
  }

  // Option 2: Gemini API
  if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.startsWith('AIzaSy')) {
    try {
      const res = await callGemini(options);
      if (res) return res;
    } catch (err) {
      console.warn('Gemini provider error, trying next fallback:', err);
    }
  }

  // Option 3: Ollama (Local)
  if (process.env.OLLAMA_BASE_URL) {
    try {
      const res = await callOllama(options);
      if (res) return res;
    } catch (err) {
      console.warn('Ollama provider error, falling back to mock:', err);
    }
  }

  // Option 4: Grounded Mock LLM
  return callMockLlm(options);
}
