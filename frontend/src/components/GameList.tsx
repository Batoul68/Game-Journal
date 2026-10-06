import type { Game } from '../types/index.ts';

export default function GameList({ games }: {games: Game[]}) {
    return (
        <>
        <ul>
        {games.map((game) => (
          <li key={game.id}>
            {game.name}
          </li>
        ))}
      </ul>
        </>
    );
}