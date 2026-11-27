import { useState } from "react";
import FormModal from "../modals/FormModal";
import JournalEntryForm from "./JournalEntryForm/JournalEntryForm";
import type { Game, JournalEntry, JournalEntryValues } from "../../types";
import { updateJournalEntry } from "../../services/journalEntryService";

type EditJournalEntryProps = {
   baseGameId: number;
   entry: JournalEntry;
   titleOptions: Game[];
   onEntryUpdated: (entry: JournalEntry) => void;
}

export default function EditJournalEntry({ baseGameId, entry, titleOptions, onEntryUpdated }: EditJournalEntryProps) {

   const [isEditing, setIsEditing] = useState(false);
   const closeModal = () => setIsEditing(false);

   const handleSave = async (values: JournalEntryValues) => {
      const updatedEntry = await updateJournalEntry(baseGameId, entry.id, values);

      onEntryUpdated(updatedEntry);
      setIsEditing(false);
   }

   return (
         isEditing ? (
            <FormModal title="Edit entry" onClose={closeModal}>
               <JournalEntryForm 
                  baseGameId={baseGameId}
                  titleOptions={titleOptions}
                  initialEntry={entry}
                  onSave={handleSave}
               />
            </FormModal>
         ) : (
            <button className='action-button' onClick={() => setIsEditing(true)}>
               Edit entry
            </button>
         )
      );
}