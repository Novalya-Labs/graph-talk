import { Header } from '@/components/header';
import { Outlet } from 'react-router-dom';

export default function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <Outlet />
    </div>
  );
}
