import React, { useState, useEffect } from 'react';
import type { GameFormValues, Game, GameMetadataResponse, PlayStatus, PlayMode } from '../../../types/index.ts';
import styles from './GameForm.module.css';
import { getGenreOptions } from '../../../services/genreService.ts';
import GameAutofill from '../GameAutofill/GameAutofill.tsx';

type GameFormProps = {
   initialGame?: Game; // supply when edit, omit when create
   onSave: (values: GameFormValues) => Promise<void>;
}

const statusLabels: Record<PlayStatus, string> = {
   NOT_SET: 'Not set',
   NOT_STARTED: 'Not started',
   CURRENTLY_PLAYING: 'Currently playing',
   ON_HOLD: 'On hold',
   FINISHED: 'Finished'
};

const modeLabels: Record<PlayMode, string> = {
   SINGLE_PLAYER: 'Single-player',
   CO_OP: 'Co-op',
   ONLINE_MULTIPLAYER: 'Online multiplayer'
};

// The input template used for editing and creating games
export default function GameForm({ initialGame, onSave }: GameFormProps) {

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
   const [playStatus, setPlayStatus] = useState<PlayStatus>(
      initialGame?.playStatus ?? 'NOT_SET'
   );
   const [playModes, setPlayModes] = useState<PlayMode[]>(
      initialGame?.playModes ?? []
   );
   const [playTime, setPlayTime] = useState(initialGame?.playTime ?? null);

   // Pull from database
   const [genreOptions, setGenreOptions] = useState<string[]>([]);

   const [isSaving, setIsSaving] = useState(false);
   const [message, setMessage] = useState('');


   // Handle saving game, parent component will either PUT or POST
   const handleSave = async (event: React.SubmitEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (isSaving) return;

      if(!name.trim()) {
         setMessage('Game title cannot be empty');
         return;
      }
      
      if(!/[a-z]/i.test(name)) {
         setMessage('Invalid game title');
         return;
      }

      setIsSaving(true);
      setMessage('');

      try {
         await onSave({
            name: name.trim(), 
            coverImageUrl: coverImageUrl.trim(), 
            rating, 
            genres, 
            review, 
            releaseYear, 
            description,
            playStatus,
            playModes,
            playTime
         });
      } catch (error) {
         setMessage(
            error instanceof Error
            ? error.message
            : 'Unable to save game.'
         );
      } finally {
         setIsSaving(false);
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
      setName(match.name);
      
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

      setGenres((current) => [...new Set([...current, ...matchingOptions])]);
   }

   return (
      <section className={styles.container}>
         <form className={styles.form} onSubmit={handleSave}>

            <fieldset className={styles['form-layout']} disabled={isSaving}>
               <div className={styles['title-panel']}>
                  <div className={styles['input-group']}>
                     <label htmlFor='game-title' >Game Title *</label>
                     <input 
                        id="game-title"
                        value={name}
                        onChange={(event) => setName(event.target.value)}  
                        placeholder='Enter game title'
                     /> 
                  </div>
                  <GameAutofill title={name} onMatchSelected={handleMatchSelected}/>
               </div>

               <div className={styles['details-panel']}>
                  <div className={styles['input-group']}>
                        <label>Cover Image</label>
                        <input 
                           value={coverImageUrl}
                           onChange={(event) => setCoverImageUrl(event.target.value)}  
                           placeholder='Enter image url'
                        />
                     </div>
                  <div className={styles['metadata-row']}>

                     <div className={styles['input-group']}>
                        <label>Hours played</label>
                        <input 
                           type="number"
                           value={playTime ?? ''}
                           onChange={(event) => {
                              const value = event.target.value;
                              setPlayTime(value === '' ? null : Number(value));
                           }}
                        />
                     </div>

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
               
               
                  <div className={styles['genre-row']}>
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

                     
                     <ul className={styles['selected-genres']} aria-label='Selected genres'>
                        {genres.map((genre) => (
                           <li key={genre}>{genre}</li>
                        ))}
                     </ul>
                  </div>

                  <div className={styles['input-group']}>
                     <label>
                        Play Status
                        <select
                           value={playStatus}
                           onChange={(event) => setPlayStatus(event.target.value as PlayStatus)}
                        >
                           {Object.entries(statusLabels).map(([value, label]) => (
                              <option key={value} value={value}>{label}</option>
                           ))}
                        </select>
                     </label>
                  </div>

                  <div className={styles['mode-chips']} role="group" aria-label="Play modes">
                     {(Object.keys(modeLabels) as PlayMode[]).map((mode) => (
                        <button
                           key={mode}
                           type="button"
                           aria-pressed={playModes.includes(mode)}
                           onClick={() => {
                              setPlayModes((current) =>
                                 current.includes(mode)
                                    ? current.filter((selected) => selected !== mode)
                                    : [...current, mode]
                              );
                           }}
                        >
                           {modeLabels[mode]}
                        </button>
                     ))}
                  </div>
                     
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
                  <button type="submit">
                     Save Game
                  </button>
               </div>
            </fieldset>
         </form>
         {message && <p>{message}</p>}
      </section>
   );
}

