import GameForm from "./GameForm";
import { useEffect, useRef } from "react";

type GameModalProps = {
onClose: () => void;
onGameAdded: () => Promise<void>;
}

export default function GameModel({ onClose, onGameAdded }: GameModalProps) {

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
      <h2 id="game-modal-title">Add game</h2>

      <GameForm onGameAdded={onGameAdded}/>
      
      <button onClick={onClose}>
      Cancel
      </button>

   </dialog>
);
}