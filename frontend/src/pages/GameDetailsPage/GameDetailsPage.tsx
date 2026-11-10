import type { Game } from "../../types";
import { getGameById } from "../../services/gameService";
import { useParams, Link } from "react-router";
import { useEffect, useState } from "react";
import EditGame from "../../components/games/EditGame";
import styles from './GameDetailsPage.module.css';

export default function GameDetailsPage() {

const [game, setGame] = useState<Game | null>(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState('');
const { gameId } = useParams();

// Load game by id
const loadGameById = async (gameId: string) => {
   try {
      const data = await getGameById(gameId);
      setGame(data);
      setError('');
   } catch (error) {
      console.error(error);
      setError(
      error instanceof TypeError 
            ? "Can't reach the backend, make sure Spring boot is running"
            : "Page not found"
      );
   } finally {
      setLoading(false);
   }
}

// Call when page mounts and game URL changes
useEffect(() => {
   if (!gameId) return;

   void loadGameById(gameId);
}, [gameId]);

if (loading) {
   return <p>Loading game...</p>;
}

if (error) {
   return <p>{error}</p>
}

if (!game) {
   return <p>Game not found</p>;
}

return (
   <main className={styles['page-container']}>
      <section className={styles['action-buttons']}>
         <Link className='action-button' to="/games">Back</Link>
         <EditGame
            key={game.id}
            game={game}
            onGameUpdated={setGame}
         />
      </section>
      
      <div className={styles['details-container']}>
        <section className={styles['info-section']}>
            <div className={styles['img-container']}>
               <img id={styles['cover-img']} src={game.coverImageUrl}/> 
            </div>
            
            <div className={styles['game-info']}>
               <h2 id={styles.title}>{game?.name}</h2>
               <p className={styles['genre-row']}>
                  <span id={styles['genre-title']}>Genre:</span> 

                  {game.genres.length > 0
                     ? game.genres.map((genre) => (
                        <span 
                           id={styles['genre-badge']}
                           key={genre}
                        >
                           {genre}
                        </span>
                     ))
                     : <span>N/A</span>
                  }
                  
               </p>  
               <p id={styles.year}>Release year: {game?.releaseYear || 'N/A'}</p>
               
            </div>
            <p id={styles.description}>
               {game?.description || 'No description yet'}
            </p>
         </section>

         <section className={styles['review-section']}>
            <h3 id={styles['review-title']}>My Review:</h3>
            <p id={styles.rating}>{game?.rating || "Not yet rated"} stars</p>
            <p id={styles.review}>{game?.review || "No review written"}</p>
         </section> 
      </div>
   </main>
);
}