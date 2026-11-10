import { useEffect, useRef, type ReactNode } from "react";
import styles from './GameModal.module.css';

type GameModalProps = {
   title: string;
   children: ReactNode;
   onClose: () => void;
}

// The modal pop up to hold GameForm when called
export default function GameModal({ title, onClose, children }: GameModalProps) {

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
   >
      <h2 id={styles.title}>{title}</h2>
      {children}
   </dialog>
);
}