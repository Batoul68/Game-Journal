import type { GameFormValues, Game } from "../../types";
import { updateGame } from "../../services/gameService";
import { useState } from "react";
import GameForm from "./GameForm";

type EditGameProps = {
   game: Game;
   onGameUpdated: (updatedGame: Game) => void;
}

export default function EditGame({ game, onGameUpdated }: EditGameProps) {
   const [isEditing, setIsEditing] = useState(false);

   const handleUpdateGame  = async (values: GameFormValues) => {
      const updatedGame = await updateGame(
         String(game.id),
         values.name,
         values.coverImageUrl,
         values.rating,
         values.genre,
         values.review
      );

      onGameUpdated(updatedGame);
      setIsEditing(false);
   }
   return (
      isEditing ? (
         <GameForm 
            initialGame={game}
            onSave={handleUpdateGame}
            onCancel={() => setIsEditing(false)}
         />
      ) : (
         <button onClick={() => setIsEditing(true)}>
            Edit game
         </button>
      )
   );
}