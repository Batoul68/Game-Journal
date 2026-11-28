import { useId, useRef, useState } from "react";
import styles from './ConfirmDeleteModal.module.css';

type ConfirmDeleteModalProps = {
   title: string;
   confirmMessage: string;
   errorMessage: string;
   onConfirm: () => Promise<unknown>;
   onDeleted: () => void;
}

export default function ConfirmDeleteModal({ title, confirmMessage, errorMessage, onConfirm, onDeleted }: ConfirmDeleteModalProps) {
   const [isDeleting, setIsDeleting] = useState(false);
   const [message, setMessage] = useState('');

   const dialogRef = useRef<HTMLDialogElement>(null);
   const titleId = useId();
   const closeModal = () => dialogRef.current?.close();

   const handleDelete = async () => {
      if (isDeleting) return;

      setIsDeleting(true);
      setMessage('');

      try {
         await onConfirm();
      } catch (error) {
         setMessage(error instanceof Error ? error.message : errorMessage);
         return;
      } finally {
         setIsDeleting(false);
      }

      closeModal();
      onDeleted();
   }

   return (
      <div>
         <button
            type="button"
            id={styles.trigger}
            aria-label={title}
            onClick={() => {
               setMessage('');
               dialogRef.current?.showModal();
            }}
         >
            -
         </button>

         <dialog 
            ref={dialogRef} 
            aria-labelledby={titleId}
            className={styles.modal}
            onCancel={(e) => {if (isDeleting) e.preventDefault()}}
         >
            <h2 id={titleId} className={styles.title}>{title}</h2>
            <p className={styles.confirm}>{confirmMessage}</p>

            {message && <p className={styles.error}>{message}</p>}

            <div className={styles.options}>
               <button 
                  type="button" 
                  onClick={handleDelete}
                  className={styles.btn}
                  disabled={isDeleting}
               >
                  Delete
               </button>

               <button 
                  className={styles.btn} 
                  type="button" 
                  onClick={() => dialogRef.current?.close()}
                  disabled={isDeleting}
               >
                  Cancel
               </button>
            </div>
         </dialog>
      </div>
   );
}