import React, { useState } from 'react';
import type { GameFormValues, Game } from '../../../types/index.ts';
import styles from './GameForm.module.css';

type GameFormProps = {
   initialGame?: Game; // supply when edit, omit when create
   onSave: (values: GameFormValues) => Promise<void>;
   onCancel: () => void;
}

const genres = ['Action', 'Adventure', 'RPG', 'Simulation', 'Strategy', 'Sports', 'Fighting', 'Shooter', 'Puzzle', 
               'Platform', 'Racing', 'Stealth', 'Survival', 'Horror', 'MMO', 'Sandbox', 'Rhythm/Music', 'Battle Royale',
               'Soulslike', 'Visual Novel', 'Dating Sim', 'Tycoon/Management', 'Trivia/Quiz'];

// The input template used for editing and creating games
export default function GameForm({ initialGame, onSave, onCancel }: GameFormProps) {

   // Allows game form to edit existing game or create new game
   const [name, setName] = useState(initialGame?.name ?? '');
   const [coverImageUrl, setCoverImageUrl] = useState(initialGame?.coverImageUrl ?? '');
   const [rating, setRating] = useState<number | null> (
      initialGame?.rating ?? null
   );
   const [genre, setGenre] = useState(initialGame?.genre ?? '');
   const [review, setReview] = useState(initialGame?.review ?? '');
   const [releaseYear, setReleaseYear] = useState<number | null> (
      initialGame?.releaseYear ?? null
   );
   const [description, setDescription] = useState(initialGame?.description ?? '');
   const [message, setMessage] = useState('');


   // Handle saving game, parent component will either PUT or POST
   const handleSave = async (event: React.SubmitEvent<HTMLFormElement>) => {
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
         await onSave({name, coverImageUrl, rating, genre, review, releaseYear, description});
         setMessage('');

      } catch (error) {
         setMessage('Unable to save game. Check that the backend is running');
      }
   }

   return (
      <section className={styles.container}>
         <form className={styles.form} onSubmit={handleSave}>
            <header>Game Form</header>
            <div className={styles['input-group']}>
               <label>Game Title *</label>
               <input 
                     value={name}
                     onChange={(event) => setName(event.target.value)}  
                     placeholder='Enter game title'
               /> 
            </div>
            <div className={styles.column}>
               <div className={styles['input-group']}>
                  <label>Cover Image</label>
                  <input 
                     value={coverImageUrl}
                     onChange={(event) => setCoverImageUrl(event.target.value)}  
                     placeholder='Enter image url'
                  />
               </div>
               <div className={styles['input-group']}>
                  <label>Genre</label>
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
               </div>
               
            </div>
            <div className={styles.column}>
               <div className={styles['input-group']}>
                  <label>Rating</label>
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
               </div>
               <div className={styles['input-group']}>
                  <label>Release Year</label>
                  <input 
                     type="number"
                     min="1942"
                     max={new Date().getFullYear()}
                     value={releaseYear ?? ''}
                     onChange={(event) => {
                        const value = event.target.value;
                        setReleaseYear(value === "" ? null : Number(value)); 
                     }}
                     placeholder='Year'
                  />
               </div>
            </div>
            <div className={styles['description-section']}>
               <div className={styles['input-group']}>
                  <label>Description</label>
                  <textarea
                  id="description"
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  rows={5}
                  placeholder='Game description'
               />
               </div>
            </div>
            <div className={styles['review-section']}>
               <div className={styles['input-group']}>
                  <label>Review</label>
                  <textarea
                  id="review"
                  value={review}
                  onChange={(event) => setReview(event.target.value)}
                  rows={5}
                  placeholder='Write a review!'
               />
               </div>
            </div>
            <div className={styles['action-buttons']}>
               <button type="button" onClick={onCancel}>
                  Cancel
               </button>

               <button type="submit">
                  Save Game
               </button>
            </div>
         </form>
         {message && <p>{message}</p>}
      </section>
   );
}

