import { useEffect, useRef, useId, type ReactNode } from "react";
import styles from './Modal.module.css';

type ModalProps = {
   title: string;
   children: ReactNode;
   onClose: () => void;
   compact?: boolean;
   closeDisabled?: boolean;
}

// The modal pop up to hold GameForm when called
export default function FormModal({ title, children, onClose, compact, closeDisabled }: ModalProps) {

   const dialogRef = useRef<HTMLDialogElement>(null);
   const titleId = useId();
   compact = false;
   closeDisabled = false;

   useEffect(() => {
      const dialog = dialogRef.current;
      if (!dialog) {
         return;
      }

      dialog.showModal();
      return () => dialog.close();
   }, []);

   return (
      <dialog 
         ref={dialogRef}
         onCancel={(event) => {
            event.preventDefault();
            onClose();
         }} 
         aria-labelledby={titleId}
         className={compact ? `${styles.container} ${styles.compact}` : styles.container}
      >
         <header className={styles['title-bar']}>
            <h2 id={titleId} className={styles.title}>{title}</h2>
            
            <a 
               className={styles['close-button']} 
               href="#"
               onClick={(event) => {
                  event.preventDefault();

                  if (!closeDisabled) onClose();
               }}
               aria-disabled={closeDisabled}
            />
         </header>
         <div className={styles.body}>{children}</div>
      </dialog>
   );
}