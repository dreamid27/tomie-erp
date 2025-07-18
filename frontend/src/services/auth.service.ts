export interface LoginCredentials {
  username: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
}

export const login = async (
  credentials: LoginCredentials
): Promise<LoginResponse> => {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Login failed');
  }

  return data;
};

export const logout = async (): Promise<void> => {
  // Clear any stored authentication data
  const token = localStorage.getItem('token');

  if (token) {
    // Optional: Call backend logout endpoint if it exists
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/auth/logout`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      // Ignore logout endpoint errors - still clear local data
      console.warn('Logout endpoint error:', error);
    }
  }

  // Clear local storage
  localStorage.removeItem('token');

  // Clear any other stored user data
  localStorage.removeItem('user');

  // Clear session storage if used
  sessionStorage.clear();
};

export const getAuthHeaders = (): HeadersInit => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};
