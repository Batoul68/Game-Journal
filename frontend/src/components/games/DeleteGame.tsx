import ConfirmDeleteModal from "../modals/ConfirmDeleteModal/ConfirmDeleteModal";
import { deleteGame } from "../../services/gameService";

type DeleteGameProps = {
   gameId: number;
   gameName: string;
   onDeleted: () => void;
};


export default function DeleteGame({ gameId, gameName, onDeleted }: DeleteGameProps) { 

   return (
      <ConfirmDeleteModal 
         title="Delete game?"
         confirmMessage={`Delete ${gameName}? This cannot be undone.`}
         errorMessage="Could not delete game, please try again"
         onConfirm={() => deleteGame(gameId)}
         onDeleted={onDeleted}
      />
   );
}