import { useRef, useState } from "react";
import { deleteGame } from "../../../services/gameService";
import styles from './DeleteGame.module.css';

type DeleteGameProps = {
   gameId: number;
   gameName: string;
   onDeleted: () => void;
};


export default function DeleteGame({ gameId, gameName, onDeleted }: DeleteGameProps) {
   const [message, setMessage] = useState('');
   const [isDeleting, setIsDeleting] = useState(false);
   const dialogRef = useRef<HTMLDialogElement>(null);

   const handleDelete = async () => {
      if (isDeleting) return;

      setMessage('');
      setIsDeleting(true);

      try {
         await deleteGame(gameId);
         onDeleted();
      } catch (error) {
         setMessage(
            error instanceof Error
            ? error.message
            : 'Could not delete game, please try again');
      } finally {
         setIsDeleting(false);
      }
   }  

   return (
      <div>
         <button 
            id={styles.button} 
            onClick={() => dialogRef.current?.showModal()} 
            disabled={isDeleting}
         >
            -
         </button>
         {message && <p role="alert">{message}</p>}

         <dialog 
            ref={dialogRef} 
            aria-labelledby={`delete-title-${gameName}`}
            className={styles.modal}
         >
            <h2 className={styles.message} >Delete game?</h2>
            <p className={styles.confirm} >Delete '{gameName}'? This cannot be undone.</p>

            <div className={styles.options} >
               <button 
                  type="button" 
                  onClick={handleDelete}
                  className={styles.btn}
               >
                  Delete
               </button>

               <button 
                  className={styles.btn} 
                  type="button" 
                  onClick={() => dialogRef.current?.close()}
               >
                  Cancel
               </button>
            </div>
         </dialog>
      </div>
   );
}