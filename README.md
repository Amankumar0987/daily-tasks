# Daily Tasks

A simple, modern task management app built with React and Tailwind CSS with Google Calendar integration.

## Features

- Add tasks with input field and Add button
- Display tasks in a clean list
- Mark tasks as complete/incomplete
- Delete tasks
- **Add tasks to Google Calendar** (one-click)
- Responsive design with dark mode support
- Tasks persisted in localStorage

## Getting Started

### Prerequisites

- Node.js 18+ installed

### Installation

```bash
cd daily-tasks
npm install
```

### Google Calendar Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **Google Calendar API**:
   - Navigate to "APIs & Services" > "Library"
   - Search for "Google Calendar API" and enable it
4. Create OAuth 2.0 credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth client ID"
   - Application type: "Web application"
   - Name: "Daily Tasks App"
   - Authorized redirect URIs: `http://localhost:5173/auth/callback`
   - Click "Create"
5. Copy the Client ID and Client Secret
6. Create a `.env` file in the project root:
   ```bash
   cp .env.example .env
   ```
7. Edit `.env` and add your credentials:
   ```
   VITE_GOOGLE_CLIENT_ID=your_client_id_here
   VITE_GOOGLE_CLIENT_SECRET=your_client_secret_here
   ```

### Development

```bash
npm run dev
```

Open http://localhost:5173 in your browser.

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Using Google Calendar Integration

1. Click "Connect Calendar" in the header
2. Sign in with your Google account and grant permission
3. Once connected, each task will show a calendar icon on hover
4. Click the calendar icon to add the task to your Google Calendar (creates a 1-hour event starting 5 minutes from now)

## Tech Stack

- React 18
- Vite
- Tailwind CSS 3
- Google APIs (googleapis)
- React Router 7
- ESLint

## Project Structure

```
daily-tasks/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── .env.example
├── public/
│   └── vite.svg
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── index.css
    ├── context/
    │   └── GoogleCalendarContext.jsx
    ├── services/
    │   └── googleCalendar.js
    ├── pages/
    │   └── AuthCallback.jsx
    └── components/
        ├── TaskInput.jsx
        ├── TaskList.jsx
        └── TaskItem.jsx
```