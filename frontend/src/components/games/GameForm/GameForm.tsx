import React, { useState, useEffect } from 'react';
import type { GameFormValues, Game, GameMetadataResponse } from '../../../types/index.ts';
import styles from './GameForm.module.css';
import { getGenreOptions } from '../../../services/genreService.ts';
import GameAutofill from '../GameAutofill/GameAutofill.tsx';

type GameFormProps = {
   showAutofill: boolean;
   initialGame?: Game; // supply when edit, omit when create
   onSave: (values: GameFormValues) => Promise<void>;
   onCancel: () => void;
}

// The input template used for editing and creating games
export default function GameForm({ showAutofill, initialGame, onSave, onCancel }: GameFormProps) {

   // Allows game form to edit existing game or create new game
   const [name, setName] = useState(initialGame?.name ?? '');
   const [coverImageUrl, setCoverImageUrl] = useState(initialGame?.coverImageUrl ?? '');
   const [rating, setRating] = useState<number | null> (
      initialGame?.rating ?? null
   );
   const [genres, setGenres] = useState<string[]>(initialGame?.genres ?? []);
   const [review, setReview] = useState(initialGame?.review ?? '');
   const [releaseYear, setReleaseYear] = useState<number | null> (
      initialGame?.releaseYear ?? null
   );
   const [description, setDescription] = useState(initialGame?.description ?? '');

   // Pull from database
   const [genreOptions, setGenreOptions] = useState<string[]>([]);
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
         await onSave({name: name.trim(), coverImageUrl: coverImageUrl.trim(), rating, genres, review, releaseYear, description});
         setMessage('');

      } catch (error) {
         setMessage('Unable to save game. Check that the backend is running');
      }
   }


   // Fetch genre options on mount
   useEffect(() => {
      getGenreOptions()
      .then(setGenreOptions)
      .catch(() => setMessage('Could not load genre options'));
   }, []);


   // Fill out form using autofill
   const handleMatchSelected = (match: GameMetadataResponse) => {
      if (match.coverImageUrl) setCoverImageUrl(match.coverImageUrl);
      if (match.releaseYear != null) setReleaseYear(match.releaseYear);
      
      // Combine summary and storyline for description
      const description = [match.summary, match.storyline]
                           .filter((text) => text?.trim())
                           .join('\n\n');
      
      if (description) setDescription(description);

      
      // Add matching genres
      const matchGenreNames = new Set(
         match.genres.map((genre) => genre.trim().toLowerCase())
      );
      
      const matchingOptions = genreOptions.filter((option) => 
         matchGenreNames.has(option.trim().toLowerCase())
      );

      console.log({
         igdbGenres: match.genres,
         databaseOptions: genreOptions,
         matchingOptions
      });
      setGenres((current) => [...new Set([...current, ...matchingOptions])]);
   }

   return (
      <section className={styles.container}>
         <form className={styles.form} onSubmit={handleSave}>
            <header>Game Form</header>
            <div className={styles['title-row']}>
               <div className={styles['input-group']}>
                  <label>Game Title *</label>
                  <input 
                        value={name}
                        onChange={(event) => setName(event.target.value)}  
                        placeholder='Enter game title'
                  /> 
               </div>
               {showAutofill && <GameAutofill title={name} onMatchSelected={handleMatchSelected}/>}
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
               <details className={styles['genre-dropdown']}>
                  <summary>Genres ({genres.length} selected)</summary>
                  <div className={styles['genre-options']}>
                  {genreOptions.map((genre) => (
                  <label key={genre}>
                     <input
                        type="checkbox"
                        checked={genres.includes(genre)}
                        onChange={() => 
                           setGenres((current) => 
                              current.includes(genre)
                              ? current.filter((name) => name !== genre)
                              : [...current, genre]
                           )
                        }
                     />
                     {genre}
                  </label>
                  ))}
                  </div>
               </details>
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
                     placeholder='Rating / 5'
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

