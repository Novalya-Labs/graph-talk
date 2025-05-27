import ErrorBoundaryPage from '@/components/error-boundary';
import RootLayout from '@/layouts/root.layout';
import NotFoundPage from '@/pages/public/not-found';
import { createBrowserRouter } from 'react-router-dom';
import { publicBrowserRoutes } from './public.routes';

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    errorElement: <ErrorBoundaryPage />,
    children: [
      ...publicBrowserRoutes,
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
]);
