import { useState } from 'react';
import type { Game } from '../../../types/index.ts';
import GameCard from '../GameCard/GameCard.tsx';
import styles from './GameCollection.module.css';
import DeleteGame from '../DeleteGame.tsx';

type GameListProps = {
   games: Game[];
   onGameDeleted: () => void;
}

export default function GameCollection({ games, onGameDeleted }: GameListProps) {

   const [isDeleteMode, setIsDeleteMode] = useState(false);

   return (
      <section>
         <h2>Games</h2>

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
                           onDeleted={onGameDeleted}
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