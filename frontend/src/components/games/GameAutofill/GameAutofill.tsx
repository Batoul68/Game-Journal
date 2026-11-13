import { useState } from "react";
import { searchGameMetadata } from "../../../services/gameMetadataService.ts";
import GameAutofillResults from "../GameAutofillResults/GameAutofillResults.tsx";
import styles from './GameAutofill.module.css';
import type { GameMetadataResponse } from "../../../types/index.ts";
import { matchRoutes } from "react-router";

type GameAutofillProps = {
   title: string;
   onMatchSelected: () => void;
}

export default function GameAutofill({ title, onMatchSelected }: GameAutofillProps) {

   const [isSearching, setIsSearching] = useState(false);
   const [error, setError] = useState('');
   const [showResults, setShowResults] = useState(false);
   const [matches, setMatches] = useState<GameMetadataResponse[]>([]);

   const handleSearch = async () => {
      try {
         setError('');
         setIsSearching(true);
         setShowResults(true);
         setMatches(await searchGameMetadata(title));

         if (matches.length === 0) {
            setError('Game not found');
         }
         
      } catch (error) {
         console.error(error);
         setError(
            error instanceof TypeError 
               ? "Can't reach the backend, make sure Spring boot is running"
               : "Could not search for game, try again"
         );
      } finally {
         setIsSearching(false);
      }
   }

   return(
      <div>
         <button 
            type="button"
            onClick={handleSearch}
            disabled={isSearching}
         >
            Autofill
         </button>
         {showResults && (
            <div className={styles['autofill-popup']}>
               {isSearching && <p>Searching...</p>}
               {!isSearching && error && <p>{error}</p>}
               {!isSearching && !error && <GameAutofillResults matches={matches}/>}
            </div>
         )}
      </div>
      
   );
}