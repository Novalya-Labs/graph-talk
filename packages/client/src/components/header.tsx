import { publicRoutes } from '@/navigations/urls';
import { Link } from 'react-router-dom';
import Logo from '@/assets/images/logo.png';
import { TrashIcon } from 'lucide-react';
import { Button } from './ui/button';
import { useAiChatStore } from '@/features/ai-chat/aiChatStore';

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { useAuthStore } from '@/features/auth/authStore';

export const Header: React.FC = () => {
  const { messages, resetMessages } = useAiChatStore();
  const { language, setLanguage } = useAuthStore();

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-gray-200 dark:border-gray-800 bg-background">
      <div className="container mx-auto px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2 flex-1">
          <Link to={publicRoutes.home} className="flex items-center gap-2">
            <img src={Logo} alt="Logo" className="size-10 rounded-full" />
            <span className="text-2xl font-bold">Graph Talk</span>
          </Link>
        </div>
        <div className="flex-1 flex justify-center">
          <ul className="flex items-center gap-4">
            <li>
              <a href="https://github.com/Novalya-Labs/graph-talk" className="hover:underline">
                <span>How it works</span>
              </a>
            </li>
          </ul>
        </div>
        <div className="flex-1 flex justify-end gap-2">
          {messages.length > 0 && (
            <Button variant="outline" size="icon" onClick={resetMessages}>
              <TrashIcon className="size-4" />
            </Button>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="flex items-center cursor-pointer p-2 rounded-full hover:bg-sidebar-accent aspect-square"
              >
                {language === 'en' ? '🇬🇧' : '🇫🇷'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 bg-popover border-border text-popover-foreground">
              <DropdownMenuItem
                onClick={() => handleLanguageChange('en')}
                className={`cursor-pointer hover:bg-accent ${language === 'en' ? 'bg-accent' : ''}`}
              >
                <span className="mr-2">🇬🇧</span>
                English
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleLanguageChange('fr')}
                className={`cursor-pointer hover:bg-accent ${language === 'fr' ? 'bg-accent' : ''}`}
              >
                <span className="mr-2">🇫🇷</span>
                Français
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};
