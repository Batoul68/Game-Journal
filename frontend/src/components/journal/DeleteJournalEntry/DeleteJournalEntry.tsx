import { useState, useRef } from "react";
import { deleteJournalEntry } from "../../../services/journalEntryService";
import styles from './DeleteJournalEntry.module.css';

type DeleteJournalEntryProps = {
   baseGameId: number;
   entryId: number;
   onDeleted: (entryId: number) => void;
}

export default function DeleteJournalEntry({ baseGameId, entryId, onDeleted }: DeleteJournalEntryProps) {
   
   const [message, setMessage] = useState('');
   const [isDeleting, setIsDeleting] = useState(false);
   const dialogRef = useRef<HTMLDialogElement>(null);

   const handleDelete = async () => {
      if (isDeleting) return;

      setIsDeleting(true);
      setMessage('');

      try {
         await deleteJournalEntry(baseGameId, entryId);
         onDeleted(entryId);
      } catch (error) {
         setMessage(
            error instanceof Error
            ? error.message
            : 'Could not delete journal entry, please try again');
      } finally {
         setIsDeleting(false);
      }
   }

   return(
      <div>
         <button 
            id={styles.button} 
            onClick={() => dialogRef.current?.showModal()} 
            disabled={isDeleting}
            >
               -
            </button>
            {message && <p role="alert">{message}</p>}

            <dialog ref={dialogRef} aria-labelledby={`delete-entry-title-${entryId}`}>
               <h2>Delete journal entry?</h2>
               <p>This cannot be undone.</p>

               <button type="button" onClick={() => dialogRef.current?.close()}>
                  Cancel
               </button>

               <button type="button" onClick={handleDelete}>
                  Delete entry
               </button>
            </dialog>
      </div>
   );
}