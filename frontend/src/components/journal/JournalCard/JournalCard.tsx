import type { JournalEntry } from "../../../types"
import styles from './JournalCard.module.css';

type JournalCardProps = {
   entry: JournalEntry;
   onSelect: (entry: JournalEntry) => void;
}

export default function JournalCard({ entry, onSelect }: JournalCardProps) {
   const preview = entry.body.length > 100
      ? `${entry.body.slice(0, 100)}...`
      : entry.body;

   return (
      <button
         className={styles.card}
         type="button"
         onClick={() => onSelect(entry)}
      >
         <time className={styles.date} dateTime={entry.createdAt} >
            {new Date(entry.createdAt).toLocaleString()}
         </time>
         
         <span className={styles.title}>{entry.title?.trim() || "Untitled"}</span>

         <span className={styles.preview}>{preview}</span>

      </button>
   );
}