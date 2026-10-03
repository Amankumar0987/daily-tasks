import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import AuthCallback from './pages/AuthCallback'
import { GoogleCalendarProvider } from './context/GoogleCalendarContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <GoogleCalendarProvider>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
        </Routes>
      </GoogleCalendarProvider>
    </BrowserRouter>
  </StrictMode>,
)