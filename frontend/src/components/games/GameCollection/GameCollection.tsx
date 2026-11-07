import { useState } from 'react';
import type { Game } from '../../../types/index.ts';
import GameCard from '../GameCard/GameCard.tsx';
import styles from './GameCollection.module.css';
import DeleteGame from '../DeleteGame/DeleteGame.tsx';
import AddGame from '../AddGame/AddGame.tsx';

type GameCollectionProps = {
   games: Game[];
   onGamesChanged: () => Promise<void>;
}

// Handles changes the game collection (adding game, deleting)
export default function GameCollection({ games, onGamesChanged }: GameCollectionProps) {

   const [isDeleteMode, setIsDeleteMode] = useState(false);

   return (
      <section className={styles.collection}>
         <div className={styles['action-buttons']}>
            <AddGame onGameAdded={onGamesChanged}/>

            <button
               id={styles.delete}
               type="button"
               onClick={() => setIsDeleteMode(!isDeleteMode)}
            >
               {isDeleteMode ? "Done" : "Delete"}
            </button>
         </div>
         
        <div className={styles['list-container']}>
            <ul className={styles['game-list']}>
               {games.map((game) => (
                  <li id={styles['game-item']} key={game.id}>
                     {isDeleteMode && (
                        <DeleteGame 
                           gameId={game.id}
                           onDeleted={onGamesChanged}
                           gameName={game.name}
                        />
                     )}
                     <GameCard game={game} isDeleteMode={isDeleteMode}/>
                  </li>
               ))}
            </ul>
         </div> 
      </section>
   );
}