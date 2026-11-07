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
      setMessage('');
      setIsDeleting(true);

      try {
         await deleteGame(gameId);
         onDeleted();
      } catch (error) {
         setMessage('Could not delete game, please try again');
      } finally {
         setIsDeleting(false);
      }
   }  

   return (
      <div>
            <button id={styles.button} onClick={() => dialogRef.current?.showModal()} disabled={isDeleting}>
               -
            </button>
            {message && <p role="alert">{message}</p>}

            <dialog ref={dialogRef} aria-labelledby={`delete-title-${gameName}`}>
               <h2>Delete game?</h2>
               <p>Delete '{gameName}'? This cannot be undone.</p>

               <button type="button" onClick={() => dialogRef.current?.close()}>
                  Cancel
               </button>

               <button type="button" onClick={handleDelete}>
                  Delete game
               </button>
            </dialog>
      </div>
   );
}