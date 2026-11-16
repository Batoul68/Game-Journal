import type { Game } from '../../../types/index.ts';
import { Link } from 'react-router';
import styles from './GameCard.module.css';
import defaultGameImg from '../../../assets/defaultGameImg.jpg';

type GameCardProps = {
   game: Game;
   isDeleteMode: boolean;
   onGameSelect?: (game: Game) => void;
}

export default function GameCard({ game, isDeleteMode, onGameSelect }: GameCardProps) {
   const cardContent = (
      <>
         <img 
            id={styles['game-card-img']}
            alt={`${game.name} cover`}
            src={game.coverImageUrl || defaultGameImg}
         />
         <span id={styles['game-card-title']}>{game.name}</span>
      </>
   );

   return(
      <div className={styles.card}>
         {onGameSelect ? (
            <button
               type="button"
               className={styles.link}
               disabled={isDeleteMode}
               onClick={() => onGameSelect(game)}
            >
               {cardContent}
            </button>
         ) : (
            <Link 
               to={`/games/${game.id}`} 
               className={styles.link}
               onClick={(event) => {
                  if (isDeleteMode) event.preventDefault();
               }}
               aria-disabled={isDeleteMode}
               tabIndex={isDeleteMode ? -1 : undefined}
            >
               {cardContent}
            </Link>
         )}
      </div>
);
}
