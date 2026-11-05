import type { Game } from '../../../types/index.ts';
import GameCard from '../GameCard/GameCard.tsx';
import styles from './GameList.module.css';

type GameListProps = {
games: Game[];
onGameDeleted: () => void;
}

export default function GameList({ games, onGameDeleted }: GameListProps) {
   return (
      <div className={styles['list-container']}>
      <ul className={styles['game-list']}>
         {games.map((game) => (
            <li key={game.id}>
            <GameCard game={game} onGameDeleted={onGameDeleted}/>
            </li>
         ))}
      </ul>
      </div>
   );
}