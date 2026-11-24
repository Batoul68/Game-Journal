import GameTabs, { type GameTab } from "../../components/games/GameTabs.tsx";
import { useParams, Link } from "react-router";
import { useState } from "react";
import EditGame from "../../components/games/EditGame";
import styles from './GameDetailsPage.module.css';
import GameOverview from "../../components/games/GameOverview/GameOverview.tsx";
import DlcTab from "../../components/games/DlcTab/DlcTab.tsx";
import JournalTab from "../../components/journal/JournalTab/JournalTab.tsx";
import GalleryTab from "../../components/journal/GalleryTab/GalleryTab.tsx";
import useGameDetails from "../../hooks/useGameDetails.ts";

export default function GameDetailsPage() {

   const { gameId } = useParams();

   const {
      game,
      journalEntries,
      dlcs,
      loading,
      error,
      setGame,
      reloadEntries,
      reloadDlcs,
      handleEntryUpdated,
      handleEntryDeleted
   } = useGameDetails(gameId);


   const [activeTab, setActiveTab] = useState<GameTab>('overview');

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
            <Link id={styles['back-link']} className='action-button' to="/games">Back to collection</Link>

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
            <DlcTab 
               parentGameId={game.id} 
               dlcs={dlcs}
               onDlcsChanged={reloadDlcs}
            />
         </>
         }

         {activeTab === 'journal' && 
         <>
            <h3>{game.name} Journal Entries</h3>
            <JournalTab 
               baseGame={game} 
               entries={journalEntries}
               dlcs={dlcs}
               onEntriesChanged={reloadEntries}
               onEntryUpdated={handleEntryUpdated}
               onEntryDeleted={handleEntryDeleted}
            />
         </>
         }

         {activeTab === 'gallery' && (
            <GalleryTab entries={journalEntries}/>
         )}
      </main>
   );
}