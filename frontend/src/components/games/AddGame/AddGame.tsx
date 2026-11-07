import { useState } from "react";
import CreateGameModal from "../CreateGameModal/CreateGameModal";
import styles from './AddGame.module.css';

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
         <button 
            id={styles.add} 
            onClick={() => setIsCreateGameOpen(true)}
            type="button"
            disabled={isCreateGameOpen}
         >
            Add
         </button>

         {isCreateGameOpen && 
            <CreateGameModal 
               onClose={() => setIsCreateGameOpen(false)} 
               onGameAdded={handleGameSaved}
            />
         }
         
      </div>
      
   );
}