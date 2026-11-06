import { useState } from "react";
import CreateGameModal from "./CreateGameModal";

type AddGameProps = {
   onGameAdded: () => Promise<void>;
}

// Handles opening/closing the CreateGameModal and the add game button
export default function AddGame({ onGameAdded }: AddGameProps) {

   const [isCreateGameOpen, setIsCreateGameOpen] = useState(false);

   const handleGameSaved = async () => {
      setIsCreateGameOpen(false);
      await onGameAdded();
   }

   return (
      <div>
         {isCreateGameOpen ? (
            <CreateGameModal 
               onClose={() => setIsCreateGameOpen(false)} 
               onGameAdded={handleGameSaved}
            />
         ) : (
            <button onClick={() => setIsCreateGameOpen(true)}>
               Add new game
            </button>
         )}
      </div>
      
   );
}