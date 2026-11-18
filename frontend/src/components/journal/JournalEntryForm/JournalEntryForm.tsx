import { useState, type FormEvent } from "react";
import type { Game, JournalEntry, JournalEntryValues } from "../../../types"

type JournalEntryFormProps = {
   baseGameId: number;
   titleOptions: Game[];
   initialEntry?: JournalEntry; // supply when edit, omit when create
   onSave: (values: JournalEntryValues) => Promise<void>;
   onCancel: () => void;
}

export default function JournalEntryForm({ baseGameId, titleOptions, initialEntry, onSave, onCancel }: JournalEntryFormProps) {

   const [targetGameId, setTargetGameId] = useState(initialEntry?.gameId ?? baseGameId);
   const [body, setBody] = useState(initialEntry?.body ?? '');

   const [isSaving, setIsSaving] = useState(false);
   const [message, setMessage] = useState('');

   const handleSubmit = async (event: React.SubmitEvent<HTMLFormElement>) {
      event.preventDefault();

      if (isSaving) return;

      const trimmedBody = body.trim();

      if (!trimmedBody) {
         setMessage('Your entry must have a body');
         return;
      }

      setIsSaving(true);
      setMessage('');

      try {
         await onSave({
            targetGameId,
            body: trimmedBody
         });

      } catch (error) {
         setMessage(
            error instanceof Error
            ? error.message
            : 'Could not save journal entry'
         );
      } finally {
         setIsSaving(false);
      }
   }

   return(
      <form onSubmit={handleSubmit}>

      </form>
   );
}