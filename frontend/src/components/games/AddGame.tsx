import { useState } from "react";
import GameForm from "./GameForm/GameForm";
import GameModal from "./GameModal/GameModal";
import type { GameFormValues } from "../../types/index.ts";
import { createDlc, createGame } from "../../services/gameService";

type AddGameProps = {
   parentGameId?: number;
   onGameAdded: () => Promise<void>;
}

// Handles creating a game, renders GameForm wrapped in GameModal
export default function AddGame({ parentGameId, onGameAdded }: AddGameProps) {

   const [isCreateGameOpen, setIsCreateGameOpen] = useState(false);
   const [showAutofill, setShowAutofill] = useState(false);
   const closeModal = () => setIsCreateGameOpen(false);


   const handleCreateGame = async (values: GameFormValues) => {

      // Create base game or dlc
      if (parentGameId === undefined) {
         await createGame(values);
      } else {
         await createDlc(parentGameId, values);
      }
      
      setIsCreateGameOpen(false);
      setShowAutofill(false);
      await onGameAdded();
   }

   return (
      <div>
         <button 
            className='action-button' 
            onClick={() => {
               setIsCreateGameOpen(true);
               setShowAutofill(true);
            }}
            type="button"
            disabled={isCreateGameOpen}
         >
            Add
         </button>

         {isCreateGameOpen && 
            <GameModal title="Add Game" onClose={closeModal}>
               <GameForm onSave={handleCreateGame} onCancel={closeModal} showAutofill={showAutofill}/>
            </GameModal>
         }
      </div>
   );
}