import type { Game, JournalEntry } from '../../../types';
import { useState, useEffect, useCallback } from 'react';
import { getJournalEntries } from '../../../services/journalEntryService';
import styles from './JournalTab.module.css';
import JournalCollection from '../JournalCollection/JournalCollection';

export default function JournalTab({ baseGame }: { baseGame: Game }) {

   const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
   const [isLoading, setIsLoading] = useState(true);
   const [error, setError] = useState('');

   const [selectedEntryId, setSelectedEntryId] = useState<number | null>(null);

   const selectedEntry = journalEntries.find(
      (entry) => entry.id === selectedEntryId
   );

   // Load the current list of journal entries
   const loadEntries = useCallback (async () => {
      setIsLoading(true);
      setError('');

      try {
         setJournalEntries(await getJournalEntries(baseGame.id));
         setError('');
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

            
         </>
      );
   }

   return(
      <JournalCollection 
         entries={journalEntries} 
         onEntrySelect={(entry) => setSelectedEntryId(entry.id)}
      />
   );
}