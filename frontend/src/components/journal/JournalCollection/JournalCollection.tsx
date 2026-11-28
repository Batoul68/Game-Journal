import { useState } from "react";
import type { Game, JournalEntry } from "../../../types";
import AddJournalEntry from "../AddJournalEntry";
import styles from './JournalCollection.module.css';
import DeleteJournalEntry from "../DeleteJournalEntry";
import JournalCard from "../JournalCard/JournalCard";

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

   // Sorting and filtering
   const [titleFilter, setTitleFilter] = useState('all');
   const [sortOrder, setSortOrder] = useState('newest');

   const visibleEntries = entries.filter((entry) => 
      titleFilter === 'all' || entry.gameId === Number(titleFilter)
   );

   visibleEntries.sort((a, b) => {
      const dateDifference = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();

      const order = dateDifference || a.id - b.id;

      return sortOrder === 'oldest' ? order : -order;
   });

   return(
      <>
         <div>
            <label>
               Game
               <select
                  value={titleFilter}
                  onChange={(event) => setTitleFilter(event.currentTarget.value)}
               >
                  <option value="all">All titles</option>

                  {titleOptions.map((game) => (
                     <option key={game.id} value={String(game.id)}>
                        {game.name}
                     </option>
                  ))}
               </select>
            </label>

            <label>
               Sort
               <select
                  value={sortOrder}
                  onChange={(event) => setSortOrder(event.currentTarget.value)}
               >
                  <option value="newest">Newest</option>
                  <option value="oldest">Oldest</option>
               </select>
            </label>
         </div>
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
            {entries.length === 0 ? (
               <p>No journal entries yet</p>
            ) : visibleEntries.length === 0 ? (
               <p>No journal entries for this title</p>
            ) : (
               <ul>
                  {visibleEntries.map((entry) => (
                     <li key={entry.id}>
                        {isDeleteMode && (
                           <DeleteJournalEntry 
                              baseGameId={baseGameId}
                              entryId={entry.id}
                              onDeleted={onEntryDeleted}
                           />
                        )}
                     
                        <JournalCard entry={entry} onSelect={onEntrySelect} />

                     </li>
                  ))}
               </ul>
            )}
         </section>
      </>
      
   );
}