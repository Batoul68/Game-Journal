import type {  JournalEntry } from "../../../types";
import styles from './GalleryTab.module.css';

export default function GalleryTab({ entries }: { entries: JournalEntry[] }) {

   const imageEntries = entries.filter((entry) => entry.imageUrl);

   return(
      <section aria-label="Journal gallery">
         {imageEntries.length === 0 ? (
            <p>No journal images yet.</p>
         ) : (
            <div className={styles.grid}>
               {imageEntries.map((entry) => (
                  <img
                     key={entry.id}
                     className={styles.image}
                     src={entry.imageUrl!}
                     alt="Screenshot from a journal entry"
                     loading="lazy"
                  />
               ))}
            </div>
         )}
      </section>
   );
}