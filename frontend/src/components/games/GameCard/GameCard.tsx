import type { Game } from '../../../types/index.ts';
import styles from './GameCard.module.css';

type GameCardProps = {
  game: Game;
}

export default function GameCard({ game }: GameCardProps) {
  return(
      <div className={styles['game-card']}>
        {game.coverImageUrl && (
          <img id={styles['game-card-img']}alt={`${game.name} cover`} src={game.coverImageUrl}/>
        )}
      
      <h3 id={styles['game-card-title']}>{game.name}</h3>
      </div>
  );
}
