import type { JournalEntry } from '../../../types';
import styles from './JournalOverview.module.css';

export default function JournalOverview({ entry }: { entry: JournalEntry }) {
   return (
      <article className={styles.container}>
         <time dateTime={entry.createdAt}>
            {new Date(entry.createdAt).toLocaleString()}
         </time>

         <p id={styles.body}>
            {entry.body}
         </p>
      </article>
   );
}