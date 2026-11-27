import type { Game, JournalEntryValues } from "../../types"
import { createJournalEntry } from "../../services/journalEntryService";
import { useState } from "react";
import JournalEntryForm from "./JournalEntryForm/JournalEntryForm";
import FormModal from "../modals/FormModal";

type AddJournalEntryProps = {
   baseGameId: number;
   titleOptions: Game[];
   onEntryAdded: () => void;
}

export default function AddJournalEntry({ baseGameId, titleOptions, onEntryAdded }: AddJournalEntryProps) {

   const [isCreateJournalOpen, setIsCreateJournalOpen] = useState(false);
   const closeModal = () => setIsCreateJournalOpen(false);

   const handleSave = async (values: JournalEntryValues) => {
      await createJournalEntry(baseGameId, values);
      
      setIsCreateJournalOpen(false);
      await onEntryAdded();
   }

   return(
      <div>
         <button 
            className='action-button' 
            onClick={() => {
               setIsCreateJournalOpen(true);
            }}
            type="button"
            disabled={isCreateJournalOpen}
         >
            Add
         </button>

         {isCreateJournalOpen && 
            <FormModal title="Add Journal Entry" onClose={closeModal}>
               <JournalEntryForm 
                  baseGameId={baseGameId} 
                  titleOptions={titleOptions}
                  onSave={handleSave}
               />
            </FormModal>
         }
      </div>
   );
}