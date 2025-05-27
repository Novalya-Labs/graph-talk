import { Button } from '@/components/ui/button';
import { publicRoutes } from '@/navigations/urls';
import { useTranslation } from 'react-i18next';
import { Link, isRouteErrorResponse, useRouteError } from 'react-router-dom';

export default function ErrorBoundaryPage() {
  const { t } = useTranslation('errorBoundary');
  const error = useRouteError();
  let errorMessage = t('subtitle');

  if (isRouteErrorResponse(error)) {
    errorMessage = error.statusText || error.data?.message || 'Unknown error';
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <h1 className="text-6xl font-bold text-gray-200 mb-4">{t('title')}</h1>
      <h2 className="text-2xl font-semibold text-gray-300 mb-6">{t('subtitle')}</h2>
      <p className="text-gray-400 max-w-md mb-8">{errorMessage}</p>
      <Link to={publicRoutes.home}>
        <Button variant="outline" size="lg">
          {t('button')}
        </Button>
      </Link>
    </div>
  );
}
