import GameCollection from "../../components/games/GameCollection/GameCollection.tsx";
import { useOutletContext } from "react-router";
import type { GamesContext } from "../GamesRouteLayout.tsx";
import styles from './GamesPage.module.css';
import LibraryOverview from "../../components/games/LibraryOverview/LibraryOverview.tsx";


// Loads the collection of games
export default function GamesPage({ username }: { username: string }) {

   const { games, error, loadGames } = useOutletContext<GamesContext>();

   return (
      <main className="container">
         <h2 id={styles.greeting}>Welcome back, {username}!</h2>

         {error && <p>{error}</p>}

         <LibraryOverview games={games}/>
         <GameCollection games={games} onGamesChanged={loadGames}/>
         
      </main>
   );
}