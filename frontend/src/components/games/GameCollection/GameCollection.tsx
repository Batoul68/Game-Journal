import { use, useState } from 'react';
import type { Game } from '../../../types/index.ts';
import GameCard from '../GameCard/GameCard.tsx';
import styles from './GameCollection.module.css';
import DeleteGame from '../DeleteGame.tsx';
import AddGame from '../AddGame.tsx';

type GameCollectionProps = {
   games: Game[];
   onGamesChanged: () => Promise<void>;
}

// Handles changes the game collection (adding game, deleting)
export default function GameCollection({ games, onGamesChanged }: GameCollectionProps) {

   const [isDeleteMode, setIsDeleteMode] = useState(false);

   return (
      <section>
         <h2>Games</h2>

         <AddGame onGameAdded={onGamesChanged}/>

         <button
            type="button"
            onClick={() => setIsDeleteMode(!isDeleteMode)}
         >
            {isDeleteMode ? "Done" : "Delete games"}
         </button>

        <div className={styles['list-container']}>
            <ul className={styles['game-list']}>
               {games.map((game) => (
                  <li key={game.id}>
                     {isDeleteMode && (
                        <DeleteGame 
                           gameId={game.id}
                           onDeleted={onGamesChanged}
                        />
                     )}
                     <GameCard game={game}/>
                  </li>
               ))}
            </ul>
         </div> 
      </section>
   );
}