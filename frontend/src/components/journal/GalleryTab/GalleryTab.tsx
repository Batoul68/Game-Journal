import { useState, useEffect, useCallback } from "react";
import { getJournalEntries } from "../../../services/journalEntryService";
import type { Game, JournalEntry } from "../../../types";
import styles from './GalleryTab.module.css';

export default function GalleryTab({ baseGame }: { baseGame: Game }) {
   const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
   const [isLoading, setIsLoading] = useState(true);
   const [error, setError] = useState('');

   // Load the current list of journal entries
   const loadEntries = useCallback (async () => {
      setIsLoading(true);
      setError('');

      try {
         const loadedEntries = await getJournalEntries(baseGame.id);
         setJournalEntries(loadedEntries);

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

   const imageEntries = journalEntries.filter((entry) => entry.imageUrl);

   return(
      <section aria-label="Journal gallery">
         {imageEntries.length === 0 ? (
            <p>No journal images yet.</p>
         ) : (
            <div className={styles.grid}>
               {imageEntries.map((entry) => (
                  <img
                     key={entry.id}
                     className={styles.image}
                     src={entry.imageUrl!}
                     alt="Screenshot from a journal entry"
                     loading="lazy"
                  />
               ))}
            </div>
         )}
      </section>
   );
}