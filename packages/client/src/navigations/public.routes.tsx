import PublicLayout from '@/layouts/public.layout';
import HomePage from '@/pages/public/home';
import NotFoundPage from '@/pages/public/not-found';
import { publicRoutes } from './urls';

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
        path: publicRoutes.notFound,
        element: <NotFoundPage />,
      },
    ],
  },
];
