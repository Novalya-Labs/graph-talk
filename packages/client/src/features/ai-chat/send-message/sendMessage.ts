import type { AiChatMessage, SqlQueryResponse } from '../aiChatType';

export const sendMessage = async (prompt: string): Promise<AiChatMessage> => {
  const response = await fetch('/api/query', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt }),
  });

  if (!response.ok) {
    throw new Error('Erreur lors de la requête');
  }

  const sqlResponse: SqlQueryResponse = await response.json();

  return {
    id: crypto.randomUUID(),
    timestamp: new Date(),
    userPrompt: prompt,
    response: sqlResponse,
  };
};
