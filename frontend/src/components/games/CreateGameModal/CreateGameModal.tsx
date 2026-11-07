import GameForm from "../GameForm/GameForm.tsx";
import { useEffect, useRef } from "react";
import { createGame } from '../../../services/gameService.ts';
import type { GameFormValues } from "../../../types/index.ts";

type CreateGameModalProps = {
onClose: () => void;
onGameAdded: () => Promise<void>;
}

// The modal pop up for creating a game, uses the input template GameForm. is called by AddGame
export default function CreateGameModal({ onClose, onGameAdded }: CreateGameModalProps) {

const dialogRef = useRef<HTMLDialogElement>(null);

const handleCreateGame = async (values: GameFormValues) => {
   await createGame(
      values.name,
      values.coverImageUrl,
      values.rating,
      values.genre,
      values.review
   );

   await onGameAdded();
}

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

      <GameForm onSave={handleCreateGame} onCancel={onClose}/>
   </dialog>
);
}