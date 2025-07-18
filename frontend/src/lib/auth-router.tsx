import { TOKEN } from '@/constants';
import { PAGE_PATH } from '@/constants/route';
import { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth-context';

export const RouteTypes = {
  Guest: 'Guest',
  Public: 'Public',
  Private: 'Private',
} as const;

interface IAuthRouter {
  type: keyof typeof RouteTypes;
  loadingComponent?: React.ReactNode;
}

const AuthRoute = ({
  type,
  loadingComponent = <div>Loading...</div>,
}: IAuthRouter) => {
  const navigate = useNavigate();
  const { isAuthenticated, refreshUser } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const authToken = localStorage.getItem(TOKEN);

      if (type === RouteTypes.Guest && authToken && isAuthenticated) {
        navigate(PAGE_PATH.HOME);
        return;
      }

      if (type === RouteTypes.Private && (!authToken || !isAuthenticated)) {
        navigate(PAGE_PATH.LOGIN);
        return;
      }

      // Refresh user data if we have a token but no user data
      if (authToken && !isAuthenticated) {
        refreshUser();
      }
    } catch (error) {
      console.error('Authentication check failed:', error);
      if (type === RouteTypes.Private) {
        navigate(PAGE_PATH.LOGIN);
      }
    } finally {
      setIsLoading(false);
    }
  }, [type, isAuthenticated]); // Added isAuthenticated to dependencies

  if (isLoading) {
    return <>{loadingComponent}</>;
  }

  return (
    <>
      <Outlet />
    </>
  );
};

export default AuthRoute;
