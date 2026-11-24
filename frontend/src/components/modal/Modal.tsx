import { useEffect, useRef, type ReactNode } from "react";
import styles from './Modal.module.css';

type ModalProps = {
   title: string;
   children: ReactNode;
   onClose: () => void;
}

// The modal pop up to hold GameForm when called
export default function Modal({ title, onClose, children }: ModalProps) {

   const dialogRef = useRef<HTMLDialogElement>(null);

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
         aria-labelledby="game-modal-title"
         className={styles.container}
      >
         <header className={styles['title-bar']}>
            <h2 id={styles.title}>{title}</h2>
            
            <a 
            className={styles['close-button']} 
            href="#"
            onClick={onClose}
            >
               Close
            </a>
         </header>
         <div className={styles.body}>{children}</div>
      </dialog>
   );
}