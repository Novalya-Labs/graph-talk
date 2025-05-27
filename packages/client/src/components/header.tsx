import { publicRoutes } from '@/navigations/urls';
import { Link } from 'react-router-dom';
import Logo from '@/assets/images/logo.png';

export const Header: React.FC = () => {
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
              <Link to={publicRoutes.howItWorks} className="hover:underline">
                <span>How it works</span>
              </Link>
            </li>
          </ul>
        </div>
        <div className="flex-1 flex justify-end" />
      </div>
    </header>
  );
};
