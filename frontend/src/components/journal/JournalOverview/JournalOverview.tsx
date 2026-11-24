import type { JournalEntry } from '../../../types';
import styles from './JournalOverview.module.css';

export default function JournalOverview({ entry }: { entry: JournalEntry }) {
   return (
      <article className={styles.container}>
         <time dateTime={entry.createdAt}>
            {new Date(entry.createdAt).toLocaleString()}
         </time>

         {entry.imageUrl && (
            <img 
               className={styles['entry-image']}
               src={entry.imageUrl}
               alt='Screenshot attached to this journal entry'
            />
         )}
         <p id={styles.body}>
            {entry.body}
         </p>
      </article>
   );
}