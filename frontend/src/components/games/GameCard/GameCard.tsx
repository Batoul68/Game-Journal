import type { Game } from '../../../types/index.ts';
import { Link } from 'react-router';
import styles from './GameCard.module.css';
import defaultGameImg from '../../../assets/defaultGameImg.jpg';

type GameCardProps = {
   game: Game;
}

export default function GameCard({ game }: GameCardProps) {
return(

      <div className={styles.card}>
         <Link to={`/games/${game.id}`}>
            {game.coverImageUrl ? (
               <img id={styles['game-card-img']}alt={`${game.name} cover`} src={game.coverImageUrl}/>
            ) : (
               <img id={styles['game-card-img']}alt={`${game.name} cover`} src={defaultGameImg}/>
            )
            }
         </Link>
         <span id={styles['game-card-title']}>{game.name}</span>
      </div>
);
}
