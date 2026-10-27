import GameForm from "../components/games/GameForm.tsx";
import GameList from "../components/games/GameList.tsx";

import { useEffect, useState } from 'react';
import { getGames } from '../services/gameService.ts';
import type { Game } from '../types/index.ts'

export default function GamesPage() {

   const [games, setGames] = useState<Game[]>([]);
   const [loadMessage, setLoadMessage] = useState('Loading...');

   // Load the current list of games
   const loadGames = async () => {
      try {
         const data = await getGames();
         setGames(data);
         setLoadMessage('');

      } catch (error) {
         console.error(error);
         setLoadMessage(
            error instanceof TypeError 
            ? "Can't reach the backend, make sure Spring boot is running"
            : "The server returned an error loading games"
         );
      }
   };

   // Call on mount
   useEffect(() => {
      loadGames();
   }, []);

   return (
      <main className="container">
         
         <h1>Game Journal</h1>

         <GameForm onGameAdded={loadGames}/>

         {loadMessage && <p>{loadMessage}</p>}

         <h2>Games</h2>

         <GameList games={games} onGameDeleted={loadGames}/>
      </main>
   );
}