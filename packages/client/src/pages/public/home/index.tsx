import { useState } from 'react';
import { useAiChatStore } from '@/features/ai-chat/aiChatStore';
import { Button } from '@/components/ui/button';
import { Footer } from '@/components/footer';
import { Textarea } from '@/components/ui/textarea';
import { ArrowUpIcon } from 'lucide-react';

const HomePage = () => {
  const [input, setInput] = useState('');

  const { messages, sendMessage, loading, error } = useAiChatStore();

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    await sendMessage(input);
    setInput('');
  };

  return (
    <div className="h-screen flex flex-col px-4">
      <div className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full p-10">
              <p>Aucun résultat encore.</p>
            </div>
          ) : (
            <table className="min-w-full border border-collapse">
              <thead>
                <tr>
                  {Object.keys(messages[0]).map((key) => (
                    <th key={key} className="border px-2 py-1 bg-gray-200">
                      {key}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {messages.map((msg, idx) => (
                  <tr key={idx}>
                    {Object.values(msg).map((val, i) => (
                      <td key={i} className="border px-2 py-1">
                        {val as string}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <div className="flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Écris ta requête SQL..."
            className="flex-1"
          />
          <div className="flex justify-center items-center">
            <Button onClick={handleSendMessage} disabled={loading} className="rounded-full aspect-square">
              <ArrowUpIcon className="size-4" />
            </Button>
          </div>
        </div>

        {error && <p className="text-red-500">{error}</p>}
        <Footer />
      </div>
    </div>
  );
};

export default HomePage;
