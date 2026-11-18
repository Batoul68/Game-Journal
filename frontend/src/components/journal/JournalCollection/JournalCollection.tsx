import type { JournalEntry } from "../../../types";
import styles from './JournalCollection.module.css';

type JournalCollectionProps = {
   entries: JournalEntry[];
   onEntrySelect: (entry: JournalEntry) => void;
}

export default function JournalCollection({ entries, onEntrySelect }: JournalCollectionProps) {

   if (entries.length === 0) {
      return <p>No journal entries yet</p>
   }
   return(
      <section aria-label="journal entries" >
         <ul>
            {entries.map((entry) => (
               <li key={entry.id}>
                  <button
                     type="button"
                     onClick={() => onEntrySelect(entry)}
                  >
                     <time dateTime={entry.createdAt}>
                        {new Date(entry.createdAt).toLocaleString()}
                     </time>

                     <p>
                        {entry.body.length > 100 
                        ? `${entry.body.slice(0, 100)}...`
                        : entry.body
                        }
                     </p>
                  </button>
               </li>
            ))}
         </ul>
      </section>
   );
}