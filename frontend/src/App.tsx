import LoginPage from './pages/LoginPage.tsx';
import GamePage from './pages/GamesPage.tsx';
import './App.css'
import { useState } from 'react';

export default function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return ( isLoggedIn
    ? <GamePage />
    : <LoginPage onLoginSuccess={() => setIsLoggedIn(true)}/>
  );
}

