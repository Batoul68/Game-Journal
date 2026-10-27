import type { Game } from '../../types/index.ts';
import DeleteGameButton from './DeleteGameButton.tsx';

type GameListProps = {
  games: Game[];
  onGameDeleted: () => void;
}

export default function GameList({ games, onGameDeleted }: GameListProps) {
    return (
        <>
        <ul>
          {games.map((game) => (
            <li key={game.id}>
              {game.name}

              <DeleteGameButton 
                gameId={game.id}
                onDeleted={onGameDeleted}
              />
            </li>
          ))}
      </ul>
        </>
    );
}