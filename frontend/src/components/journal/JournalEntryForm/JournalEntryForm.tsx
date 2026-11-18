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

   const [targetGameId, setTargetGameId] = useState(initialEntry?.gameId ?? baseGameId);
   const [body, setBody] = useState(initialEntry?.body ?? '');

}