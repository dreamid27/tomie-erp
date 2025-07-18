import { BottomNav } from './bottom-nav';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useLayout } from '@/contexts/layout-context';
import { Button } from '@/components/ui/button';
import { Settings, FileText, FileCheck } from 'lucide-react';
import { useScroll } from '@/hooks/use-scroll';
import { cn } from '@/lib/utils';

const navItems = [
  { name: 'Quotation', path: '/quotation', icon: FileText },
  { name: 'Sales Order', path: '/sales-order', icon: FileCheck },
];

export function MainLayout() {
  const { showBottomNav } = useLayout();
  const { scrollDirection, isAtTop } = useScroll();
  const location = useLocation();

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
        <div className="container mx-auto p-4 max-w-4xl flex justify-between items-center">
          <h1 className="text-xl font-semibold md:hidden">Tomie ERP</h1>

          {/* Desktop Navigation Menu */}
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    'flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          <div>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/settings" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                <span className="hidden sm:inline">Settings</span>
              </Link>
            </Button>
          </div>
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
