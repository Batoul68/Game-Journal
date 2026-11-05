import type { Game } from '../../../types/index.ts';
import { Link } from 'react-router';
import DeleteGameButton from '../DeleteGameButton.tsx';
import styles from './GameCard.module.css';

type GameCardProps = {
game: Game;
onGameDeleted: () => void;
}

export default function GameCard({ game, onGameDeleted }: GameCardProps) {
return(
      <div className={styles['game-card']}>

      {game.coverImageUrl && (
         <Link to={`/games/${game.id}`}>
            <img id={styles['game-card-img']}alt={`${game.name} cover`} src={game.coverImageUrl}/>
         </Link>
      )}
      
      <div className={styles['game-card-footer']}>
         <Link to={`/games/${game.id}`}>
            <h3 id={styles['game-card-title']}>{game.name}</h3>
         </Link>

         <details className={styles['game-menu']}>
            <summary aria-label={`Actions for ${game.name}`}>
               ⋮
            </summary>

         <div className={styles['game-menu-options']}>
            <DeleteGameButton 
            gameId={game.id}
            onDeleted={onGameDeleted}
            />
         </div>
      </details>
      </div>
      
      </div>
);
}
