import { HelmetProvider } from 'react-helmet-async';
import { RouterProvider } from 'react-router-dom';
import { Toaster } from './components/ui/sonner';
import { LanguageProvider } from './contexts/language-provider';
import { ThemeProvider } from './contexts/theme-provider';
import { router } from './navigations/routes';

export default function App() {
  return (
    <HelmetProvider>
      <ThemeProvider>
        <LanguageProvider>
          <RouterProvider router={router} />
          <Toaster />
        </LanguageProvider>
      </ThemeProvider>
    </HelmetProvider>
  );
}
