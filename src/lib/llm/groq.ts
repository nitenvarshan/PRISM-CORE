import { LlmRequestOptions, LlmResponse } from './adapter';

export async function callGroq(options: LlmRequestOptions): Promise<LlmResponse | null> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return null;

  const messages: any[] = [
    { role: 'system', content: options.systemPrompt },
    { role: 'user', content: options.userMessage },
  ];

  const payload: any = {
    model: 'llama-3.3-70b-versatile',
    messages,
    temperature: options.temperature ?? 0.2,
    max_tokens: 800,
  };

  if (options.tools && options.tools.length > 0) {
    payload.tools = options.tools.map((t) => ({
      type: 'function',
      function: {
        name: t.name,
        description: t.description,
        parameters: t.parameters,
      },
    }));
    payload.tool_choice = 'auto';
  }

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Groq API error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  const choice = data.choices?.[0]?.message;

  if (!choice) return null;

  const toolCalls = choice.tool_calls?.map((tc: any) => ({
    name: tc.function.name,
    arguments: typeof tc.function.arguments === 'string' ? JSON.parse(tc.function.arguments) : tc.function.arguments,
  }));

  return {
    content: choice.content || '',
    toolCalls,
    providerUsed: 'groq',
  };
}
