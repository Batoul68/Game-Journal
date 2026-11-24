import type { Game, JournalEntry } from '../../../types';
import { useState } from 'react';
import styles from './JournalTab.module.css';
import JournalCollection from '../JournalCollection/JournalCollection';
import JournalOverview from '../JournalOverview/JournalOverview';
import EditJournalEntry from '../EditJournalEntry';

type JournalTabProps = {
   baseGame: Game;
   entries: JournalEntry[];
   dlcs: Game[];
   onEntriesChanged: () => Promise<void>;
   onEntryUpdated: (entry: JournalEntry) => void;
   onEntryDeleted: (entryId: number) => void;
}

export default function JournalTab({ baseGame, entries, dlcs, onEntriesChanged, onEntryUpdated, onEntryDeleted}: JournalTabProps) {

   const [selectedEntryId, setSelectedEntryId] = useState<number | null>(null);

   const selectedEntry = entries.find(
      (entry) => entry.id === selectedEntryId
   );

   // Build title options
   const titleOptions = [baseGame, ...dlcs];

   const handleEntryDeleted = (entryId: number) => {
      onEntryDeleted(entryId);

      setSelectedEntryId((current) => 
         current === entryId ? null : current
      );
   }

   if (selectedEntry) {
      return (
         <>
            <button
               type="button"
               onClick={() => setSelectedEntryId(null)}
            >
               Back to journal
            </button>

            <EditJournalEntry 
               baseGameId={baseGame.id}
               entry={selectedEntry}
               titleOptions={titleOptions}
               onEntryUpdated={onEntryUpdated}
            />

            <JournalOverview entry={selectedEntry} />
         </>
      );
   }

   return(
      <>
         <JournalCollection 
            baseGameId={baseGame.id}
            titleOptions={titleOptions}
            entries={entries} 
            onEntrySelect={(entry) => setSelectedEntryId(entry.id)}
            onEntriesChanged={onEntriesChanged}
            onEntryDeleted={handleEntryDeleted}
         />
      </>
   );
}