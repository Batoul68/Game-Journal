import React, { useEffect, useState } from 'react';
import './App.css'

const API = 'http://localhost:8080/api/games';

type Game = {
  id: number;
  name: string;
};

export default function App() {

  const [games, setGames] = useState<Game[]>([]);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('Loading...');

  const loadGames = async () => {
    try {
      const response = await fetch(API);

      if (!response.ok) {
        throw new Error('Backend returned an error');
      }

      const data = await response.json();

      setGames(data);
      setMessage('');

    } catch (error) {
      console.error(error);
      setMessage('Cannot connect to Spring Boot. Start the backend first.');
    }
  };

  useEffect(() => {
    loadGames();
  }, []);

  const addGame = async (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    if(!name.trim()) {
      return;
    }

    try {
      const response = await fetch(API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: name.trim()
        })
      });

      if (!response.ok) {
        throw new Error('Unable to add game');
      }

      setName('');

      await loadGames();

    } catch (error) {
      setMessage('Unable to add product. Check that the backend is running');
    }
  }

  return (
    <main className="container">
      <h1>Add games</h1>

      <form onSubmit={addGame}>
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

