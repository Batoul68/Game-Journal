import type { Game } from '../../../types/index.ts';
import { Link } from 'react-router';
import styles from './GameCard.module.css';
import defaultGameImg from '../../../assets/defaultGameImg.jpg';

type GameCardProps = {
   game: Game;
   isDeleteMode: boolean;
}

export default function GameCard({ game, isDeleteMode }: GameCardProps) {
return(

      <div className={styles.card}>
         <Link 
            to={`/games/${game.id}`} 
            className={styles.link}
            onClick={(event) => {
               if (isDeleteMode) event.preventDefault();
            }}
            aria-disabled={isDeleteMode}
            tabIndex={isDeleteMode ? -1 : undefined}
         >
            {game.coverImageUrl ? (
               <img id={styles['game-card-img']}alt={`${game.name} cover`} src={game.coverImageUrl}/>
               ) : (
               <img id={styles['game-card-img']}alt={`${game.name} cover`} src={defaultGameImg}/>
               )
            }
            <span id={styles['game-card-title']}>{game.name}</span>
         </Link>
         
      </div>
);
}
