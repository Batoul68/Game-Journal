import type { GameFormValues, Game } from "../../types/index.ts";
import { updateGame } from "../../services/gameService";
import { useState } from "react";
import GameForm from "./GameForm/GameForm";
import GameModal from "./GameModal/GameModal";

type EditGameProps = {
   game: Game;
   onGameUpdated: (updatedGame: Game) => void;
}

// Handles editing a game, renders GameForm wrapped in GameModal
export default function EditGame({ game, onGameUpdated }: EditGameProps) {

   const [isEditing, setIsEditing] = useState(false);
   const closeModal = () => setIsEditing(false);

   const handleUpdateGame  = async (values: GameFormValues) => {
      const updatedGame = await updateGame(String(game.id), values);

      onGameUpdated(updatedGame);
      setIsEditing(false);
   }

   return (
      isEditing ? (
         <GameModal title="Edit Game" onClose={closeModal}>
            <GameForm 
               initialGame={game}
               onSave={handleUpdateGame}
               onCancel={closeModal}
            />
         </GameModal>
      ) : (
         <button className='action-button' onClick={() => setIsEditing(true)}>
            Edit game
         </button>
      )
   );
}