import { useState } from "react";
import type { Game, JournalEntry, JournalEntryValues } from "../../../types"

type JournalEntryFormProps = {
   baseGameId: number;
   titleOptions: Game[];
   initialEntry?: JournalEntry; // supply when edit, omit when create
   onSave: (values: JournalEntryValues) => Promise<void>;
   onCancel: () => void;
}

export default function JournalEntryForm({ baseGameId, titleOptions, initialEntry, onSave, onCancel }: JournalEntryFormProps) {

   const [imageFile, setImageFile] = useState<File | null>(null);
   const [targetGameId, setTargetGameId] = useState(initialEntry?.gameId ?? baseGameId);
   const [body, setBody] = useState(initialEntry?.body ?? '');

   const [isSaving, setIsSaving] = useState(false);
   const [message, setMessage] = useState('');

   const handleSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (isSaving) return;

      const trimmedBody = body.trim();

      if (!trimmedBody) {
         setMessage('You must include an entry');
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
         <fieldset disabled={isSaving}>
            <legend>Journal Entry</legend>

            <label>
               Image
               <input 
                  type="file"
                  accept="image/*"
                  onChange={(event) => {
                     const selectedFile = event.currentTarget.files?.[0] ?? null;
                     setImageFile(selectedFile);
                  }}
               />
            </label>

            <label>
               Game
               <select
                  value={targetGameId}
                  onChange={(event) => setTargetGameId(Number(event.currentTarget.value))}
               >
                  {titleOptions.map((game) => (
                     <option key={game.id} value={game.id}>
                        {game.name}
                     </option>
                  ))}
               </select>
            </label>

            <label>
               Entry
               <textarea 
                  value={body}
                  onChange={(e) => setBody(e.currentTarget.value)}
                  rows={8}
                  required
               />
            </label>

            {message && <p>{message}</p>}

            <button type="submit">
               Save
            </button>

            <button type="button" onClick={onCancel}>
               Cancel
            </button>

         </fieldset>
      </form>
   );
}