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
         <img id={styles['game-card-img']}alt={`${game.name} cover`} src={game.coverImageUrl}/>
      )}
      
      <div className={styles['game-card-footer']}>
      <Link id={styles['game-card-title']} to={`/games/${game.id}`}>{game.name}</Link>

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
