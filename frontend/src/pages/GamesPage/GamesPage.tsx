import GameCollection from "../../components/games/GameCollection/GameCollection.tsx";
import { useOutletContext } from "react-router";
import type { GamesContext } from "../GamesRouteLayout.tsx";
import styles from './GamesPage.module.css';


// Loads the collection of games
export default function GamesPage({ username }: { username: string }) {

   const { games, isLoading, error, loadGames } = useOutletContext<GamesContext>();
   return (
      <main className="container">
         <h2 id={styles.greeting}>Welcome back, {username}!</h2>

         {error && <p>{error}</p>}

         <GameCollection games={games} onGamesChanged={loadGames}/>
         
      </main>
   );
}