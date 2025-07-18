export interface JWTPayload {
  sub: string;
  username: string;
  role: string;
  customer_id?: string;
  iat?: number;
  exp?: number;
}

export const decodeJWT = (token: string): JWTPayload | null => {
  try {
    // JWT has 3 parts separated by dots
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }

    // Decode the payload (second part)
    const payload = parts[1];

    // Add padding if needed for base64 decoding
    const paddedPayload = payload + '='.repeat((4 - (payload.length % 4)) % 4);

    // Decode base64
    const decodedPayload = atob(paddedPayload);

    // Parse JSON
    return JSON.parse(decodedPayload) as JWTPayload;
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
};

export const isTokenExpired = (token: string): boolean => {
  const payload = decodeJWT(token);
  if (!payload || !payload.exp) {
    return true;
  }

  // exp is in seconds, Date.now() is in milliseconds
  return payload.exp * 1000 < Date.now();
};

export const getUserFromToken = (token: string): JWTPayload | null => {
  if (isTokenExpired(token)) {
    return null;
  }

  return decodeJWT(token);
};
