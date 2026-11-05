import type { Game } from "../types";
import { getGameById } from "../services/gameService";
import { useParams, Link } from "react-router";
import { useEffect, useState } from "react";

export default function GameDetailsPage() {

const [game, setGame] = useState<Game | null>(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState('');
const { gameId } = useParams();

// Load game by id
const loadGameById = async (gameId: string) => {
   try {
      const data = await getGameById(gameId);
      setGame(data);
      setError('');
   } catch (error) {
      console.error(error);
      setError(
      error instanceof TypeError 
            ? "Can't reach the backend, make sure Spring boot is running"
            : "Page not found"
      );
   } finally {
      setLoading(false);
   }
}

// Call when page mounts and game URL changes
useEffect(() => {
   if (!gameId) return;

   void loadGameById(gameId);
}, [gameId]);

if (loading) {
   return <p>Loading game...</p>;
}

if (error) {
   return <p>{error}</p>
}

return (
   <div>
      <Link to="/games">Back to games</Link>
      <h1>Game Details for game {gameId}</h1>
      <h2>Title: {game?.name}</h2>
      <h2>Rating: {game?.rating ?? "Not rated"}</h2>
      <h2>Genre: {game?.genre ?? "No genre selected"}</h2>
      <h2>Review: {game?.review ?? "No review written"}</h2>
   </div>
);
}