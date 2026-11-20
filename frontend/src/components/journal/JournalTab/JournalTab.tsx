import type { Game, JournalEntry } from '../../../types';
import { useState, useEffect, useCallback } from 'react';
import { getJournalEntries } from '../../../services/journalEntryService';
import { getDlcs } from '../../../services/gameService';
import styles from './JournalTab.module.css';
import JournalCollection from '../JournalCollection/JournalCollection';
import JournalOverview from '../JournalOverview/JournalOverview';
import EditJournalEntry from '../EditJournalEntry';

export default function JournalTab({ baseGame }: { baseGame: Game }) {

   const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
   const [isLoading, setIsLoading] = useState(true);
   const [error, setError] = useState('');

   // Journal entries can belong to DLCs too
   const [dlcs, setDlcs] = useState<Game[]>([]);

   const [selectedEntryId, setSelectedEntryId] = useState<number | null>(null);

   const selectedEntry = journalEntries.find(
      (entry) => entry.id === selectedEntryId
   );

   // Load the current list of journal entries
   const loadEntries = useCallback (async () => {
      setIsLoading(true);
      setError('');

      try {
         const [loadedEntries, loadedDlcs] = await Promise.all([
            getJournalEntries(baseGame.id),
            getDlcs(baseGame.id)
         ]);

         setJournalEntries(loadedEntries);
         setDlcs(loadedDlcs);

      } catch (error) {
         console.error(error);
         setError(
            error instanceof TypeError 
            ? "Can't reach the backend, make sure Spring boot is running"
            : "The server returned an error loading journal entries"
         );
      } finally {
         setIsLoading(false);
      }
   }, [baseGame.id]);
   
   // Call on mount and if function reference changes on later renders
   useEffect(() => {
      void loadEntries();
   }, [loadEntries]);

   // Update list of entries when updating journal entry
   const handleEntryUpdated = (updatedEntry: JournalEntry) => {
      setJournalEntries((current) => 
         current.map((entry) => 
            entry.id === updatedEntry.id ? updatedEntry : entry
         )
      );
   }

   // Update list of entries when deleting journal entry
   const handleEntryDeleted = (entryId: number) => {
      setJournalEntries((current) =>
         current.filter((entry) => entry.id !== entryId)
      );

      setSelectedEntryId((current) =>
         current === entryId ? null : current
      );
   }

   // Build title options
   const titleOptions = [baseGame, ...dlcs];

   if (isLoading) {
      return <p>Loading game...</p>;
   }

   if (error) {
      return <p>{error}</p>
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
               onEntryUpdated={handleEntryUpdated}
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
            entries={journalEntries} 
            onEntrySelect={(entry) => setSelectedEntryId(entry.id)}
            onEntriesChanged={loadEntries}
            onEntryDeleted={handleEntryDeleted}
         />
      </>
   );
}