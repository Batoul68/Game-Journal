import CreateGameModal from "../components/games/CreateGameModal.tsx";
import GameCollection from "../components/games/GameCollection/GameCollection.tsx";

import { useEffect, useState } from 'react';
import { getGames } from '../services/gameService.ts';
import type { Game } from '../types/index.ts'

export default function GamesPage() {

   const [games, setGames] = useState<Game[]>([]);
   const [loadMessage, setLoadMessage] = useState('Loading...');
   const [isCreateGameOpen, setIsCreateGameOpen] = useState(false);

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

   // Close the GameForm when a game is added
   const handleGameSaved = async () => {
      setIsCreateGameOpen(false);
      await loadGames();
   }
   
   return (
      <main className="container">

         {isCreateGameOpen ? (
            <CreateGameModal 
               onClose={() => setIsCreateGameOpen(false)} 
               onGameAdded={handleGameSaved}
            />
         ) : (
            <button onClick={() => setIsCreateGameOpen(true)}>
               Add new game
            </button>
         )}

         {loadMessage && <p>{loadMessage}</p>}

         <GameCollection games={games} onGameDeleted={loadGames}/>
         
      </main>
   );
}