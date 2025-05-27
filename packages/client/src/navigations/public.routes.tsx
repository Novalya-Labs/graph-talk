import PublicLayout from '@/layouts/public.layout';
import HomePage from '@/pages/public/home';
import NotFoundPage from '@/pages/public/not-found';
import { publicRoutes } from './urls';
import { HowItWorksPage } from '@/pages/public/how-it-works';

export const publicBrowserRoutes = [
  {
    element: <PublicLayout />,
    children: [
      {
        index: true,
        path: publicRoutes.home,
        element: <HomePage />,
      },
      {
        path: publicRoutes.howItWorks,
        element: <HowItWorksPage />,
      },
      {
        path: publicRoutes.notFound,
        element: <NotFoundPage />,
      },
    ],
  },
];
