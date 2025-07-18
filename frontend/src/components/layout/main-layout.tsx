import { BottomNav } from './bottom-nav';
import { Outlet, Link } from 'react-router-dom';
import { useLayout } from '@/contexts/layout-context';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';
import { useScroll } from '@/hooks/use-scroll';
import { cn } from '@/lib/utils';

export function MainLayout() {
  const { showBottomNav } = useLayout();
  const { scrollDirection, isAtTop } = useScroll();

  // Determine if header should be visible
  const isHeaderVisible = isAtTop || scrollDirection === 'up';

  return (
    <div className="flex min-h-screen flex-col">
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 h-[60px] border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60',
          'flex items-center justify-between px-4 transition-transform duration-300 ease-in-out',
          isHeaderVisible ? 'translate-y-0' : '-translate-y-full'
        )}
      >
        <h1 className="text-xl font-semibold">Tomie ERP</h1>
        <div>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Settings</span>
            </Link>
          </Button>
        </div>
      </header>
      {/* Add top padding to account for fixed header */}
      <main className={`flex-1 pt-[60px] ${showBottomNav ? 'pb-16' : ''}`}>
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
