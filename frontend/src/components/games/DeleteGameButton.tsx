import { useState } from "react";
import { deleteGame } from "../../services/gameService";

type DeleteGameButtonProps = {
    gameId: number;
    onDeleted: () => void;
};


export default function DeleteGameButton({ gameId, onDeleted }: DeleteGameButtonProps) {
    const [message, setMessage] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);

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
            <button onClick={handleDelete} disabled={isDeleting}>
                Delete
            </button>
            {message && <p role="alert">{message}</p>}
        </div>
    );


}