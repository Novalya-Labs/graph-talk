import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

export const ThemeToggle = () => {
  const [theme, setTheme] = useState<string>('');

  useEffect(() => {
    // Get initial theme from localStorage or system preference
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');

    setTheme(initialTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
    localStorage.setItem('theme', newTheme);
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="p-2 text-gray-800 dark:text-gray-200 transition-colors duration-200 cursor-pointer"
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {theme === 'dark' ? <Sun size={18} className="transition-all" /> : null}
      {theme === 'light' ? <Moon size={18} className="transition-all" /> : null}
    </button>
  );
};
