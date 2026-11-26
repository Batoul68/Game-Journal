import styles from './GameOverview.module.css';
import type { Game } from '../../../types';

export default function GameOverview({ game }: { game: Game }) {

   return(
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
                  <p>Hours played: {game?.playTime || 'N/A'}</p>
                  
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
   );
}