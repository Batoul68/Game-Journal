import { useState } from "react";
import type { Game } from "../../../types";
import GameCollection from "../GameCollection/GameCollection";
import GameOverview from "../GameOverview/GameOverview";
import EditGame from "../EditGame";
import styles from './DlcTab.module.css';

type DlcTabProps = {
   parentGameId: number;
   dlcs: Game[];
   onDlcsChanged: () => Promise<void>;
}

export default function DlcTab({ parentGameId, dlcs, onDlcsChanged }: DlcTabProps) {

   const [selectedDlcId, setSelectedDlcId] = useState<number | null>(null);

   const [refreshError, setRefreshError] = useState('');

   const selectedDlc = dlcs.find((dlc) => dlc.id === selectedDlcId);

   const handleDlcUpdated = async () => {
      setRefreshError('');

      try {
         await onDlcsChanged();
      } catch {
         setRefreshError('The DLC was saved, but the collection could not refresh');
      }
   }

   if (selectedDlc) {
      return (
         <>
            <div className={styles['action-buttons']}>
               <button
                  id={styles['back-button']}
                  onClick={() => setSelectedDlcId(null)}
               >
                  Back to DLC list
               </button>

               <div id={styles['edit-button']}>
                  <EditGame 
                     game={selectedDlc} 
                     onGameUpdated={handleDlcUpdated}
                  />
               </div>
            </div>

            {refreshError && (
               <p role="alert">{refreshError}</p>
            )}
            
            <GameOverview game={selectedDlc} />
         </>
      );
   }
   return(
      <GameCollection 
         games={dlcs} 
         parentGameId={parentGameId} 
         onGamesChanged={onDlcsChanged} 
         onGameSelect={(dlc) => setSelectedDlcId(dlc.id)}
      />
   );
}