import LoginPage from './pages/LoginPage.tsx';
import GamePage from './pages/GamesPage.tsx';
import GameDetailsPage from './pages/GameDetailsPage.tsx';
import Header from './components/header/Header.tsx';
import './App.css'
import { checkSession } from './services/authService.ts';
import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from "react-router";

export default function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [sessionError, setSessionError] = useState('');

  

  // Check for authenticated session on mount
  useEffect(() => {
    const loadSession = async () => {
      try {
        const authenticated = await checkSession();
        setIsLoggedIn(authenticated);
      } catch (error) {
        setSessionError('Could not check your session');
      } finally {
        setIsCheckingSession(false);
      }
    }

    void loadSession();
  }, []);

  if (isCheckingSession) {
    return <p>Checking your session...</p>;
  }

  if (sessionError) {
    return <p>{sessionError}</p>
  }

  return ( isLoggedIn
    ? <>
        <Header onLogout={() => setIsLoggedIn(false)}/>
          <Routes>
            <Route path="/" element={<Navigate to="/games" replace />} />
            <Route path="/games" element={<GamePage />} />
            <Route path="games/:gameId" element={<GameDetailsPage />} />
            <Route path="*" element={<p>Page not found</p>} />
          </Routes>
      </>
    : <LoginPage onLoginSuccess={() => setIsLoggedIn(true)}/>
  );
}

