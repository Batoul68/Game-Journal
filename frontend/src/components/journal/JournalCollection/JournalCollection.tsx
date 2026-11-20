import type { Game, JournalEntry } from "../../../types";
import AddJournalEntry from "../AddJournalEntry";
import styles from './JournalCollection.module.css';

type JournalCollectionProps = {
   baseGameId: number;
   titleOptions: Game[];
   entries: JournalEntry[];
   onEntrySelect: (entry: JournalEntry) => void;
   onEntriesChanged: () => Promise<void>;
}

export default function JournalCollection({ baseGameId, titleOptions, entries, onEntrySelect, onEntriesChanged }: JournalCollectionProps) {

   if (entries.length === 0) {
      return <p>No journal entries yet</p>
   }

   return(
      <>
         <AddJournalEntry 
            baseGameId={baseGameId}
            titleOptions={titleOptions}
            onEntryAdded={onEntriesChanged}
         />

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
      </>
      
   );
}