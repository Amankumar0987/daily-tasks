import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  initGoogleAuth,
  getAuthUrl,
  handleAuthCallback,
  loadStoredTokens,
  isAuthenticated,
  signOut,
  createCalendarEvent,
} from '../services/googleCalendar';

const GoogleCalendarContext = createContext(null);

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

const REDIRECT_URI = `${window.location.origin}/auth/callback`;

export function GoogleCalendarProvider({ children }) {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (GOOGLE_CLIENT_ID) {
      initGoogleAuth(GOOGLE_CLIENT_ID);
      const hasTokens = loadStoredTokens();
      setAuthenticated(hasTokens && isAuthenticated());
    }
    setLoading(false);
  }, []);

  const login = useCallback(async () => {
    if (!GOOGLE_CLIENT_ID) {
      alert(
        'Google Client ID not configured. Please set VITE_GOOGLE_CLIENT_ID in .env'
      );
      return;
    }

    try {
      await getAuthUrl();
      setAuthenticated(true);
    } catch (error) {
      console.error('Google Calendar login failed:', error);
      alert(`Google Calendar login failed: ${error.message}`);
    }
  }, []);
    const logout = useCallback(() => {
      signOut();
      setAuthenticated(false);
    }, []);

    const handleCallback = useCallback(async () => {
      setAuthenticated(true);
    }, []);

  const addToCalendar = useCallback(async (taskText, startTime, durationMinutes) => {
    if (!authenticated) {
      throw new Error('Not authenticated');
    }
    return createCalendarEvent(taskText, startTime, durationMinutes);
  }, [authenticated]);

  const value = {
    authenticated,
    loading,
    login,
    logout,
    handleCallback,
    addToCalendar,
    clientId: GOOGLE_CLIENT_ID,
  };

  return (
    <GoogleCalendarContext.Provider value={value}>
      {children}
    </GoogleCalendarContext.Provider>
  );
}

export function useGoogleCalendar() {
  const context = useContext(GoogleCalendarContext);
  if (!context) {
    throw new Error('useGoogleCalendar must be used within a GoogleCalendarProvider');
  }
  return context;
}