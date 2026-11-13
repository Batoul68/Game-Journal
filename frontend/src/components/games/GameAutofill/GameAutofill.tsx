import { useState, useEffect, useRef } from "react";
import { searchGameMetadata } from "../../../services/gameMetadataService.ts";
import GameAutofillResults from "../GameAutofillResults/GameAutofillResults.tsx";
import styles from './GameAutofill.module.css';
import type { GameMetadataResponse } from "../../../types/index.ts";

type GameAutofillProps = {
   title: string;
   onMatchSelected: (match: GameMetadataResponse) => void;
}

export default function GameAutofill({ title, onMatchSelected }: GameAutofillProps) {

   const [isSearching, setIsSearching] = useState(false);
   const [error, setError] = useState('');
   const [showResults, setShowResults] = useState(false);
   const [matches, setMatches] = useState<GameMetadataResponse[]>([]);

   const autofillRef = useRef<HTMLDivElement>(null); 

   useEffect(() => {
      if (!showResults) return;

      const handleOutsideClick = (event: MouseEvent) => {
         const wrapper = autofillRef.current;

         if (wrapper && event.target instanceof Node && !wrapper.contains(event.target)) {
            setShowResults(false);
         }
      }

      document.addEventListener("click", handleOutsideClick);

      return () => document.removeEventListener("click", handleOutsideClick);
   }, [showResults]);

   const handleSearch = async () => {
      try {
         setError('');
         setIsSearching(true);
         setShowResults(true);

         const searchResults = await searchGameMetadata(title);
         setMatches(searchResults);

         if (searchResults.length === 0) {
            setError('No matching games found');
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
      <div ref={autofillRef}>
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
               {!isSearching && !error && 
                  <GameAutofillResults 
                     matches={matches}
                     onMatchSelected={(match) => {
                        onMatchSelected(match);
                        setShowResults(false);
                     }}
                  />
               }
            </div>
         )}
      </div>
      
   );
}