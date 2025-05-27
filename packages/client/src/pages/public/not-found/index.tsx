import { Button } from '@/components/ui/button';
import { env } from '@/configs/env';
import { publicRoutes } from '@/navigations/urls';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  const { t } = useTranslation();

  return (
    <>
      <Helmet>
        <title>{`${env.app.name} | ${t('common:notFound.title')}`}</title>
        <link rel="canonical" href={`${window.location.origin}/not-found`} />
      </Helmet>
      <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
        <h1 className="text-6xl font-bold text-gray-200 mb-4">{t('common:notFound.title')}</h1>
        <h2 className="text-2xl font-semibold text-gray-300 mb-6">{t('common:notFound.subtitle')}</h2>
        <p className="text-gray-400 max-w-md mb-8">{t('common:notFound.description')}</p>
        <Link to={publicRoutes.signIn}>
          <Button variant="outline" size="lg">
            {t('common:notFound.button')}
          </Button>
        </Link>
      </div>
    </>
  );
}
