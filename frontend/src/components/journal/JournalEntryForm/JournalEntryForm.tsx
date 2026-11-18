import type { Game, JournalEntryValues } from "../../../types"

type JournalEntryFormProps = {
   titleOptions: Game[];
   initialValues: JournalEntryValues;
   onSave: (values: JournalEntryValues) => Promise<void>;
   onCancel: () => void;
}

export default function JournalEntryForm({ titleOptions, initialValues, onSave, onCancel }: JournalEntryFormProps) {

}