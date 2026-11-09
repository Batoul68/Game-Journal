import LoginPage from './pages/LoginPage/LoginPage.tsx';
import GamePage from './pages/GamesPage/GamesPage.tsx';
import GameDetailsPage from './pages/GameDetailsPage/GameDetailsPage.tsx';
import Header from './components/header/Header/Header.tsx';
import './App.css'
import { checkSession } from './services/authService.ts';
import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from "react-router";
import type { SessionUser } from './types/index.ts';

export default function App() {

   const [isCheckingSession, setIsCheckingSession] = useState(true);
   const [sessionError, setSessionError] = useState('');
   const [user, setUser] = useState<SessionUser | null>(null);
   const navigate = useNavigate();

   // Check for authenticated session on mount
   useEffect(() => {
      const loadSession = async () => {
         try {
            setUser(await checkSession());
         } catch (error) {
            setSessionError('Could not check your session');
         } finally {
            setIsCheckingSession(false);
         }
      }

      void loadSession();
   }, []);

   const handleLoginSuccess = async () => {
      setUser(await checkSession());
      navigate("/games", { replace: true });
   }

   if (isCheckingSession) {
      return <p>Checking your session...</p>;
   }

   if (sessionError) {
      return <p>{sessionError}</p>
   }

   return (
      <div className="wrapper">
         {user
         ? <>
            <Header onLogout={() => setUser(null)}/>
               <Routes>
                  <Route path="/" element={<Navigate to="/games" replace />} />
                  <Route path="/games" element={<GamePage username={user.username}/>} />
                  <Route path="games/:gameId" element={<GameDetailsPage />} />
                  <Route path="*" element={<p>Page not found</p>} />
               </Routes>
            </>
         : <LoginPage onLoginSuccess={handleLoginSuccess}/>}
      </div>
   );
}
