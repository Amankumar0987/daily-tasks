

const SCOPES = 'https://www.googleapis.com/auth/calendar.events';

let accessToken = null;
let tokenClient = null;
let initialized = false;

export function initGoogleAuth(clientId) {
  if (!clientId) {
    throw new Error('Google Client ID is missing');
  }

  if (!window.google?.accounts?.oauth2) {
    throw new Error(
      'Google Identity Services is not loaded'
    );
  }

  tokenClient = window.google.accounts.oauth2.initTokenClient({
    client_id: clientId,
    scope: SCOPES,

    callback: (response) => {
      if (response.error) {
        console.error('Google OAuth error:', response);
        return;
      }

      accessToken = response.access_token;

      localStorage.setItem(
        'google-calendar-access-token',
        accessToken
      );
    },
  });

  initialized = true;

  const savedToken = localStorage.getItem(
    'google-calendar-access-token'
  );

  if (savedToken) {
    accessToken = savedToken;
  }
}

export function getAuthUrl() {
  if (!initialized || !tokenClient) {
    throw new Error('Google Auth is not initialized');
  }

  return new Promise((resolve, reject) => {
    tokenClient.callback = (response) => {
      if (response.error) {
        reject(new Error(response.error));
        return;
      }

      accessToken = response.access_token;

      localStorage.setItem(
        'google-calendar-access-token',
        accessToken
      );

      resolve(accessToken);
    };

    tokenClient.requestAccessToken({
      prompt: accessToken ? '' : 'consent',
    });
  });
}

export function loadStoredTokens() {
  const savedToken = localStorage.getItem(
    'google-calendar-access-token'
  );

  if (savedToken) {
    accessToken = savedToken;
    return true;
  }

  return false;
}

export async function handleAuthCallback() {
  return accessToken;
}

export function isAuthenticated() {
  return Boolean(accessToken);
}

export function signOut() {
  if (
    accessToken &&
    window.google?.accounts?.oauth2
  ) {
    window.google.accounts.oauth2.revoke(
      accessToken,
      () => {
        console.log('Google access revoked');
      }
    );
  }

  accessToken = null;

  localStorage.removeItem(
    'google-calendar-access-token'
  );
}

export async function createCalendarEvent(
  taskText,
  startTime = new Date(),
  durationMinutes = 60
) {
  if (!accessToken) {
    throw new Error(
      'Not authenticated with Google Calendar'
    );
  }

  const start = new Date(startTime);

  const end = new Date(
    start.getTime() +
      durationMinutes * 60 * 1000
  );

  const timeZone =
    Intl.DateTimeFormat().resolvedOptions().timeZone;

  const event = {
    summary: taskText,

    description:
      'Created from Daily Tasks app',

    start: {
      dateTime: start.toISOString(),
      timeZone,
    },

    end: {
      dateTime: end.toISOString(),
      timeZone,
    },

    reminders: {
      useDefault: false,
      overrides: [
        {
          method: 'popup',
          minutes: 10,
        },
        {
          method: 'popup',
          minutes: 0,
        },
      ],
    },
  };

  const response = await fetch(
    'https://www.googleapis.com/calendar/v3/calendars/primary/events',
    {
      method: 'POST',

      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },

      body: JSON.stringify(event),
    }
  );

  if (!response.ok) {
    const error = await response.text();

    throw new Error(
      `Google Calendar API error: ${response.status} ${error}`
    );
  }

  return response.json();
}