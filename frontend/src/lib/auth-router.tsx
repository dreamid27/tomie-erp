import { TOKEN } from '@/constants';
import { PAGE_PATH } from '@/constants/route';
import { useEffect } from 'react';
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
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  useEffect(() => {
    // Don't make navigation decisions while auth is still loading
    if (authLoading) {
      return;
    }

    const authToken = localStorage.getItem(TOKEN);

    // Now make navigation decisions based on current auth state
    if (type === RouteTypes.Guest && authToken && isAuthenticated) {
      navigate(PAGE_PATH.HOME);
      return;
    }

    if (type === RouteTypes.Private && (!authToken || !isAuthenticated)) {
      navigate(PAGE_PATH.LOGIN);
      return;
    }
  }, [type, isAuthenticated, authLoading, navigate]);

  if (authLoading) {
    return <>{loadingComponent}</>;
  }

  return (
    <>
      <Outlet />
    </>
  );
};

export default AuthRoute;
