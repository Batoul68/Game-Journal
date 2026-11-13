import { useState } from "react";
import GameForm from "./GameForm/GameForm";
import GameModal from "./GameModal/GameModal";
import type { GameFormValues } from "../../types/index.ts";
import { createGame } from "../../services/gameService";

// Handles creating a game, renders GameForm wrapped in GameModal
export default function AddGame({ onGameAdded }: { onGameAdded: () => Promise<void>}) {

   const [isCreateGameOpen, setIsCreateGameOpen] = useState(false);
   const closeModal = () => setIsCreateGameOpen(false);


   const handleCreateGame = async (values: GameFormValues) => {
      await createGame(values);
      
      setIsCreateGameOpen(false);
      await onGameAdded();
   }

   return (
      <div>
         <button 
            className='action-button' 
            onClick={() => setIsCreateGameOpen(true)}
            type="button"
            disabled={isCreateGameOpen}
         >
            Add
         </button>

         {isCreateGameOpen && 
            <GameModal title="Add Game" onClose={closeModal}>
               <GameForm onSave={handleCreateGame} onCancel={closeModal}/>
            </GameModal>
         }
      </div>
   );
}