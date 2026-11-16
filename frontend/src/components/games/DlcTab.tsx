import { useState, useEffect, useCallback } from "react";
import type { Game } from "../../types";
import { getDlcs } from "../../services/gameService";
import GameCollection from "./GameCollection/GameCollection";
import GameOverview from "./GameOverview/GameOverview";

export default function DlcTab({ parentGameId }: {parentGameId: number}) {

   const [dlcs, setDlcs] = useState<Game[]>([]);
   const [isLoading, setIsLoading] = useState(true);
   const [error, setError] = useState('');

   const [selectedDlcId, setSelectedDlcId] = useState<number | null>(null);

   const selectedDlc = dlcs.find((dlc) => dlc.id === selectedDlcId);

   // Load the current list of dlcs
   const loadDlcs = useCallback (async () => {
      setIsLoading(true);
      setError('');

      try {
         setDlcs(await getDlcs(parentGameId));
         setError('');
      } catch (error) {
         console.error(error);
         setError(
            error instanceof TypeError 
            ? "Can't reach the backend, make sure Spring boot is running"
            : "The server returned an error loading dlcs"
         );
      } finally {
         setIsLoading(false);
      }
   }, [parentGameId]);

   // Call on mount and if function reference changes on later renders
   useEffect(() => {
      void loadDlcs();
   }, [loadDlcs]);

   if (isLoading) {
      return <p>Loading game...</p>;
   }

   if (error) {
      return <p>{error}</p>
   }

   if (selectedDlc) {
      return (
         <>
            <button
               onClick={() => setSelectedDlcId(null)}
            >
               Back to DLC list
            </button>

            <GameOverview game={selectedDlc} />
         </>
      );
   }
   return(
      <GameCollection 
         games={dlcs} 
         parentGameId={parentGameId} 
         onGamesChanged={loadDlcs} 
         onGameSelect={(dlc) => setSelectedDlcId(dlc.id)}
      />
   );
}