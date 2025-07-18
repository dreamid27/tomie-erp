import { BottomNav } from './bottom-nav';
import { Outlet } from 'react-router-dom';
import { useLayout } from '@/contexts/layout-context';

export function MainLayout() {
  const { showBottomNav } = useLayout();

  return (
    <div className="flex min-h-screen flex-col">
      <header className="h-[60px] border-b  flex items-center px-4">
        <h1 className="text-xl font-semibold">Tomie ERP</h1>
      </header>
      <main className={`flex-1 ${showBottomNav ? 'pb-16' : ''}`}>
        <Outlet />
      </main>
      {showBottomNav && (
        <div className="md:hidden">
          <BottomNav />
        </div>
      )}
    </div>
  );
}
