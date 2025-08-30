// Utility functions for handling authentication tokens
import { decode } from 'jsonwebtoken';
import Cookies from "js-cookie";

export interface TokenPayload {
  userId: string;
  role?: string;
  exp: number;
  iat: number;
  [key: string]: any;
}

export const setAuthTokens = (accessToken: string, refreshToken: string) => {
  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken);
};

export const getAccessToken = (): string | null => {
  return localStorage.getItem('accessToken');
};

export const getRefreshToken = (): string | null => {
  return localStorage.getItem('refreshToken');
};

export const clearAuthTokens = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
};

export const isAuthenticated = (): boolean => {
  return !!getAccessToken();
};

// Add this to your auth.ts
export const refreshAuthToken = async (): Promise<{ accessToken: string; refreshToken: string } | null> => {
  try {
    const refreshToken = getRefreshToken();
    console.log('Refresh token:', refreshToken ? 'exists' : 'missing');
    
    if (!refreshToken) {
      console.error('No refresh token found');
      return null;
    }
    
    // Check if refresh token is expired
    if (isTokenExpired(refreshToken)) {
      console.log('Refresh token expired');
      clearAuthTokens();
      return null;
    }
    
    console.log('Attempting to refresh token...');
    const response = await fetch('/api/auth/refresh', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
      credentials: 'same-origin',
    });
    
    const data = await response.json();
    console.log('Refresh response:', { status: response.status, data });
    
    if (response.ok && data.success) {
      console.log('Successfully refreshed tokens');
      // Update both tokens in localStorage
      setAuthTokens(data.data.accessToken, data.data.refreshToken);
      
      // Return new tokens
      return {
        accessToken: data.data.accessToken,
        refreshToken: data.data.refreshToken
      };
    }
    
    console.error('Token refresh failed with status:', response.status);
    return null;
  } catch (error) {
    console.error('Error refreshing token:', error);
    return null;
  }
};

export const getValidToken = async (): Promise<string | null> => {
  let accessToken = getAccessToken();
  
  // If no access token, return null
  if (!accessToken) return null;
  
  // If access token is still valid, return it
  if (!isTokenExpired(accessToken)) {
    return accessToken;
  }
  
  // Access token is expired, try to refresh
  const newTokens = await refreshAuthToken();
  return newTokens?.accessToken || null;
};

// Get current user info from token
export const getCurrentUser = (): TokenPayload | null => {
  const token = getAccessToken();
  if (!token) return null;
  return decodeToken(token);
};

export const decodeToken = (token: string): TokenPayload | null => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(atob(base64));
    return payload as TokenPayload;
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

export const getTokenExpiration = (token: string): number | null => {
  try {
    const decoded = decode(token) as TokenPayload | null;
    return decoded?.exp ? decoded.exp * 1000 : null;
  } catch (error) {
    return null;
  }
};

export const isTokenExpired = (token: string): boolean => {
  const expiration = getTokenExpiration(token);
  if (expiration === null) return true;
  // Add a small buffer (5 seconds) to account for clock skew
  return expiration < Date.now() - 5000;
};