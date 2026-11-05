import React, { useState } from 'react';
import { createGame } from '../../services/gameService.ts';

const genres = ['Action', 'Adventure', 'RPG', 'Simulation', 'Strategy', 'Sports', 'Fighting', 'Shooter', 'Puzzle', 
               'Platform', 'Racing', 'Stealth', 'Survival', 'Horror', 'MMO', 'Sandbox', 'Rhythm/Music', 'Battle Royale',
               'Soulslike', 'Visual Novel', 'Dating Sim', 'Tycoon/Management', 'Trivia/Quiz'];

export default function GameForm({ onGameAdded }: { onGameAdded: () => Promise<void>}) {

const [name, setName] = useState('');
const [coverImageUrl, setCoverImageUrl] = useState('');
const [rating, setRating] = useState<number | null> (null);
const [genre, setGenre] = useState('');
const [review, setReview] = useState('');
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
      await createGame(name, coverImageUrl, rating, genre, review);

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

         <input 
            type="number"
            min="0"
            max="5"
            step="0.5"
            value={rating ?? ''}
            onChange={(event) => {
               const value = event.target.value;
               setRating(value === "" ? null : Number(value)); 
            }}
            placeholder='Rating'
         />

         <select
            id="genre"
            value={genre}
            onChange={(event) => setGenre(event.target.value)}
         >
            <option value="">Select a genre</option>
            {genres.map((genreName) => (
               <option key={genreName} value={genreName}>
                  {genreName}
               </option>
            ))}
         </select>

         <textarea
            id="review"
            value={review}
            onChange={(event) => setReview(event.target.value)}
            rows={5}
            placeholder='Write a review!'
         />

         <button type="submit">
            Add Game
         </button>
      </form>

      {message && <p>{message}</p>}
   </>
);
}

