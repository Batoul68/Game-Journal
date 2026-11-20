import { useState } from "react";
import type { Game, JournalEntry } from "../../../types";
import AddJournalEntry from "../AddJournalEntry";
import styles from './JournalCollection.module.css';
import DeleteJournalEntry from "../DeleteJournalEntry/DeleteJournalEntry";

type JournalCollectionProps = {
   baseGameId: number;
   titleOptions: Game[];
   entries: JournalEntry[];
   onEntrySelect: (entry: JournalEntry) => void;
   onEntriesChanged: () => Promise<void>;
   onEntryDeleted: (entryId: number) => void;
}

export default function JournalCollection({ baseGameId, titleOptions, entries, onEntrySelect, onEntriesChanged, onEntryDeleted }: JournalCollectionProps) {

   const [isDeleteMode, setIsDeleteMode] = useState(false);

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

         <button
            className='action-button'
            type="button"
            onClick={() => setIsDeleteMode(!isDeleteMode)}
         >
            {isDeleteMode ? "Done" : "Delete"}
         </button>

         <section aria-label="journal entries" >
            <ul>
               {entries.map((entry) => (
                  <li key={entry.id}>
                     {isDeleteMode && (
                        <DeleteJournalEntry 
                           baseGameId={baseGameId}
                           entryId={entry.id}
                           onDeleted={onEntryDeleted}
                        />
                     )}
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