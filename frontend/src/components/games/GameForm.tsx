import React, { useState } from 'react';
import { createGame } from '../../services/gameService.ts';

export default function GameForm({ onGameAdded }: { onGameAdded: () => Promise<void>}) {

  const [name, setName] = useState('');
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [message, setMessage] = useState('');


  // POST new game
  const handleAddGame = async (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();


    if(!name.trim()) {
      setMessage('Game title cannot be empty');
      return;
    }
    
    if(!/[a-z]/i.test(name)) {
      setMessage('Invalid game title');
      return;
    }

    try {
      await createGame(name, coverImageUrl);

      setName('');
      setMessage('');

      await onGameAdded();

    } catch (error) {
      setMessage('Unable to add game. Check that the backend is running');
    }
  }

  return (
    <>
      <form onSubmit={handleAddGame}>
        <input 
          value={name}
          onChange={(event) => setName(event.target.value)}  
          placeholder='Enter game title'
        />
        <input 
          value={coverImageUrl}
          onChange={(event) => setCoverImageUrl(event.target.value)}  
          placeholder='Enter image url'
        />

        <button type="submit">
          Add Game
        </button>
      </form>

      {message && <p>{message}</p>}
    </>
  );
}

