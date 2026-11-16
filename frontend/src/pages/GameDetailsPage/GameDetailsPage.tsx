import type { Game } from "../../types/index.ts";
import GameTabs, { type GameTab } from "../../components/games/GameTabs.tsx";
import { getGameById } from "../../services/gameService";
import { useParams, Link } from "react-router";
import { useEffect, useState } from "react";
import EditGame from "../../components/games/EditGame";
import styles from './GameDetailsPage.module.css';
import GameOverview from "../../components/games/GameOverview/GameOverview.tsx";
import DlcTab from "../../components/games/DlcTab.tsx";

export default function GameDetailsPage() {

   const [game, setGame] = useState<Game | null>(null);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState('');
   const { gameId } = useParams();

   const [activeTab, setActiveTab] = useState<GameTab>('overview');

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

   if (!game) {
      return <p>Game not found</p>;
   }

   return (
      <main className={styles['page-container']}>
         <section className={styles['action-buttons']}>
            <Link id={styles['back-link']} className='action-button' to="/games">Back</Link>

            <div className={styles.tabs}>
               <GameTabs activeTab={activeTab} onTabChange={setActiveTab} />
            </div>
            
            <div id={styles['edit-button']}>
               {activeTab === 'overview' && 
                  <EditGame
                     key={game.id}
                     game={game}
                     onGameUpdated={setGame}
                  />
               }
            </div>
         </section>

         {activeTab === 'overview' && <GameOverview game={game} />}
         {activeTab === 'dlc' && 
         <>
            <h3>{game.name} DLCS</h3>
            <DlcTab parentGameId={game.id}/>
         </>
         
         
         }
         {activeTab === 'journal' && <p>Journal entries here</p>}
         {activeTab === 'gallery' && <p>Images here</p>}
      </main>
   );
}