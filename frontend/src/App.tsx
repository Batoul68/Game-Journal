import React, { useEffect, useState } from 'react';
import { getGames, createGame } from './services/games.ts';
import type { Game } from './types/index.ts'
import './App.css'

export default function App() {

  const [games, setGames] = useState<Game[]>([]);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('Loading...');

  const loadGames = async () => {
    try {
      const data = await getGames();
      setGames(data);
      setMessage('');

    } catch (error) {
      console.error(error);
      setMessage(
        error instanceof TypeError 
        ? "Can't reach the backend, make sure Spring boot is running"
        : 'The server returned an error loading games'
      );
    }
  };

  useEffect(() => {
    loadGames();
  }, []);

  const handleAddGame = async (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    if(!name.trim()) {
      return;
    }

    try {
      await createGame(name);
      setName('');
      await loadGames();

    } catch (error) {
      setMessage('Unable to add game. Check that the backend is running');
    }
  }

  return (
    <main className="container">
      <h1>Add games</h1>

      <form onSubmit={handleAddGame}>
        <input 
          value={name}
          onChange={(event) => setName(event.target.value)}  
          placeholder='Enter game title'
        />
        <button type="submit">
          Add Game
        </button>
      </form>

      {message && <p>{message}</p>}

      <h2>Games</h2>

      <ul>
        {games.map((game) => (
          <li key={game.id}>
            {game.name}
          </li>
        ))}
      </ul>
    </main>
  );
}

