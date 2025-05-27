export const sendMessage = async (prompt: string) => {
  const response = await fetch('/api/query', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt }),
  });

  if (!response.ok) {
    throw new Error('Erreur lors de la requête');
  }

  return response.json();
};
