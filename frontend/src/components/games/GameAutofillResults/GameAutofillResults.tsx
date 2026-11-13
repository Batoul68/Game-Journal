import type { GameMetadataResponse } from "../../../types";
import styles from './GameAutofillResults.module.css';

type GameAutofillResultsProps = {
   matches: GameMetadataResponse[];
   onMatchSelected: (match: GameMetadataResponse) => void;
}

export default function GameAutofillResults({ matches, onMatchSelected }: GameAutofillResultsProps) {

   return(
      <ul>
        {matches.map((match) => (
            <li key={match.igdbId}>
               <button type="button" onClick={() => onMatchSelected(match)}>
                  {match.coverImageUrl && (
                     <img id={styles.cover} src={match.coverImageUrl} />
                  )}
                  {match.name}
                  -
                  {match.releaseYear ?? ''}
               </button>
            </li>
        ))}
      </ul>
      
   );
}