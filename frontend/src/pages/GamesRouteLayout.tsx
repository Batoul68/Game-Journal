import { useState, useEffect, useCallback } from "react";
import { getGames } from '../services/gameService.ts';
import type { Game } from '../types/index.ts';
import { Outlet } from "react-router";

export type GamesContext = {
   games: Game[];
   isLoading: boolean;
   error: string;
   loadGames: () => Promise<void>;
}

export default function GamesRouteLayout() {
   
   const [games, setGames] = useState<Game[]>([]);
   const [isLoading, setIsLoading] = useState(true);
   const [error, setError] = useState('');

   // Load the current list of games
   const loadGames = useCallback (async () => {
      setIsLoading(true);
      setError('');

      try {
         setGames(await getGames());
         setError('');
      } catch (error) {
         console.error(error);
         setError(
            error instanceof TypeError 
            ? "Can't reach the backend, make sure Spring boot is running"
            : "The server returned an error loading games"
         );
      } finally {
         setIsLoading(false);
      }
   }, []);

   // Call on mount and if function reference changes on later renders
   useEffect(() => {
      void loadGames();
   }, [loadGames]);

   return (
      <Outlet context={{ games, isLoading, error, loadGames }} />
   );
}