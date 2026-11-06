import type { Game } from '../../../types/index.ts';
import { Link } from 'react-router';
import DeleteGame from '../DeleteGame.tsx';
import styles from './GameCard.module.css';
import defaultGameImg from '../../../assets/defaultGameImg.jpg';

type GameCardProps = {
game: Game;
onGameDeleted: () => void;
}

export default function GameCard({ game, onGameDeleted }: GameCardProps) {
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
         <details className={styles['game-menu']}>
            <summary aria-label={`Actions for ${game.name}`}>
               ⋮
            </summary>

            <div className={styles['game-menu-options']}>
               <DeleteGame
               gameId={game.id}
               onDeleted={onGameDeleted}
               />
               </div>

         </details>
      </div>
);
}
