import { BottomNav } from './bottom-nav';
import { Outlet, Link } from 'react-router-dom';
import { useLayout } from '@/contexts/layout-context';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';

export function MainLayout() {
  const { showBottomNav } = useLayout();

  return (
    <div className="flex min-h-screen flex-col">
      <header className="h-[60px] border-b flex items-center justify-between px-4">
        <h1 className="text-xl font-semibold">Tomie ERP</h1>
        <div className="hidden md:block">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </Link>
          </Button>
        </div>
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
