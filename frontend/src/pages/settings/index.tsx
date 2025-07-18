import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useTheme } from '@/components/theme-provider';
import { useNavigate } from 'react-router-dom';
import { logout } from '@/services/auth.service';
import { PAGE_PATH } from '@/constants/route';
import { toast } from 'sonner';
import { LogOut, Moon, Sun, Monitor } from 'lucide-react';

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // Use the logout service
      await logout();

      // Show success message
      toast.success('Logged out successfully');

      // Navigate to login page
      navigate(PAGE_PATH.LOGIN);
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Error during logout');
    }
  };

  const getThemeIcon = () => {
    switch (theme) {
      case 'light':
        return <Sun className="h-4 w-4" />;
      case 'dark':
        return <Moon className="h-4 w-4" />;
      default:
        return <Monitor className="h-4 w-4" />;
    }
  };

  const getThemeLabel = () => {
    switch (theme) {
      case 'light':
        return 'Light Mode';
      case 'dark':
        return 'Dark Mode';
      default:
        return 'System Theme';
    }
  };

  const cycleTheme = () => {
    const themes = ['light', 'dark', 'system'] as const;
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 max-w-2xl">
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Settings
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Manage your account settings and preferences.
          </p>
        </div>

        {/* Appearance Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>
              Customize how the application looks and feels.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="space-y-1">
                <Label className="text-base font-medium">Theme</Label>
                <div className="text-sm text-muted-foreground">
                  Choose your preferred theme or follow system settings.
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={cycleTheme}
                className="flex items-center gap-2 min-w-[120px] sm:min-w-[140px]"
              >
                {getThemeIcon()}
                {getThemeLabel()}
              </Button>
            </div>

            {/* Theme Options */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              <Button
                variant={theme === 'light' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTheme('light')}
                className="flex flex-col items-center gap-2 h-auto py-3 sm:py-4"
              >
                <Sun className="h-4 w-4" />
                <span className="text-xs sm:text-sm">Light</span>
              </Button>
              <Button
                variant={theme === 'dark' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTheme('dark')}
                className="flex flex-col items-center gap-2 h-auto py-3 sm:py-4"
              >
                <Moon className="h-4 w-4" />
                <span className="text-xs sm:text-sm">Dark</span>
              </Button>
              <Button
                variant={theme === 'system' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTheme('system')}
                className="flex flex-col items-center gap-2 h-auto py-3 sm:py-4"
              >
                <Monitor className="h-4 w-4" />
                <span className="text-xs sm:text-sm">System</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Account Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
            <CardDescription>
              Manage your account and authentication settings.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Separator />
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="space-y-1">
                  <Label className="text-base font-medium">Sign Out</Label>
                  <div className="text-sm text-muted-foreground">
                    Sign out of your account and return to the login page.
                  </div>
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="flex items-center gap-2 w-full sm:w-auto"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you sure you want to sign out?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        You will be logged out of your account and redirected to
                        the login page.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="flex-col-reverse gap-2 sm:flex-row sm:gap-0">
                      <AlertDialogCancel className="mt-2 sm:mt-0">
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleLogout}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Sign Out
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
