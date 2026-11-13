import type { GameMetadataResponse } from "../../../types";
import styles from './GameAutofillResults.module.css';

export default function GameAutofillResults({ matches }: { matches: GameMetadataResponse[] | null }) {

   return(
      <ul>
        {matches?.map((match) => (
            <li>
               <button type="button">
                  {match.coverImageUrl && (
                     <img id={styles.cover} src={match.coverImageUrl} />
                  )}
                  {match.name}
                  -
                  {match.releaseYear}
               </button>
            </li>
        ))}
      </ul>
      
   );
}