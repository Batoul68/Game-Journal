import { deleteJournalEntry } from "../../services/journalEntryService";
import ConfirmDeleteModal from "../modals/ConfirmDeleteModal/ConfirmDeleteModal";

type DeleteJournalEntryProps = {
   baseGameId: number;
   entryId: number;
   onDeleted: (entryId: number) => void;
}

export default function DeleteJournalEntry({ baseGameId, entryId, onDeleted }: DeleteJournalEntryProps) {

   return(
      <ConfirmDeleteModal 
         title="Delete journal entry?"
         confirmMessage="This cannot be undone."
         errorMessage="Could not delete journal entry, please try again"
         onConfirm={() => deleteJournalEntry(baseGameId, entryId)}
         onDeleted={() => onDeleted(entryId)}
      />
   );
}