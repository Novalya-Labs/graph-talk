import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAiChatStore } from '@/features/ai-chat/aiChatStore';
import { SqlResultDisplay } from '@/features/ai-chat/components/SqlResultDisplay';
import { Button } from '@/components/ui/button';
import { Footer } from '@/components/footer';
import { Textarea } from '@/components/ui/textarea';
import { ArrowUpIcon, Database, Loader2 } from 'lucide-react';

const HomePage = () => {
  const [input, setInput] = useState('');
  const { t } = useTranslation('home');

  const { messages, sendMessage, loading, error, clearError } = useAiChatStore();

  const handleSendMessage = async () => {
    if (!input.trim() || loading) return;

    clearError();
    await sendMessage(input);
    setInput('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="h-screen flex flex-col px-4 pt-20">
      <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full">
        <div className="flex-1 overflow-y-auto mb-4">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <Database className="size-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">{t('emptyState.title')}</p>
                <p className="text-sm text-muted-foreground mt-2">{t('emptyState.example')}</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message) => (
                <SqlResultDisplay key={message.id} message={message} />
              ))}
            </div>
          )}
        </div>

        <div className="sticky bottom-0 space-y-2 bg-background pt-2">
          {error && <div className="text-red-500 text-sm bg-red-50 dark:bg-red-950 p-3 rounded-md">{error}</div>}

          <div className="flex gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder={t('placeholder')}
              className="flex-1 min-h-[60px] resize-none"
              disabled={loading}
            />
            <div className="flex justify-center items-center">
              <Button
                onClick={handleSendMessage}
                disabled={loading || !input.trim()}
                className="rounded-full aspect-square h-[60px] w-[60px]"
              >
                {loading ? <Loader2 className="size-4 animate-spin" /> : <ArrowUpIcon className="size-4" />}
              </Button>
            </div>
          </div>
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
