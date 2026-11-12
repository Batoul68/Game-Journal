import { useState } from 'react';
import type { Game } from '../../../types/index.ts';
import GameCard from '../GameCard/GameCard.tsx';
import styles from './GameCollection.module.css';
import DeleteGame from '../DeleteGame/DeleteGame.tsx';
import AddGame from '../AddGame.tsx';
import GameSearch from '../GameSearch.tsx';
import GameSort from '../GameSort.tsx';

type GameCollectionProps = {
   games: Game[];
   onGamesChanged: () => Promise<void>;
}

export type SortBy = 'title a-z' | 'title z-a' | 'highest rating' | 'lowest rating' | 'recently added' | 'oldest added'; 

const filterGamesByTitle = (games: Game[], search: string): Game[] => {
   const trimmedSearch = search.trim().toLowerCase();

   return games.filter((game) => 
      game.name.toLowerCase().includes(trimmedSearch)
   );
}

// Handles changes the game collection (adding game, deleting) and sort + search
export default function GameCollection({ games, onGamesChanged }: GameCollectionProps) {

   const [isDeleteMode, setIsDeleteMode] = useState(false);
   const [search, setSearch] = useState('');
   const [sortBy, setSortBy] = useState<SortBy>('recently added');

   // For GameSearch
   const visibleGames = filterGamesByTitle(games, search);

   // For GameSort
   switch (sortBy) {
      case 'recently added': 
         visibleGames.sort((a, b) => b.id - a.id);
         break;
      case 'oldest added':
         visibleGames.sort((a, b) => a.id - b.id);
         break;
      case 'title a-z':
         visibleGames.sort((a, b) => a.name.localeCompare(b.name));
         break;
      case 'title z-a':
         visibleGames.sort((a, b) => b.name.localeCompare(a.name));
         break;
      case 'highest rating':
         visibleGames.sort((a, b) => {
            const ratingOrder = (b.rating ?? -1) - (a.rating ?? -1); //-1 if unrated
            return ratingOrder || a.name.localeCompare(b.name); // sort by name if both unrated/same rating
         });
         break;
      case 'lowest rating':
         visibleGames.sort((a, b) => {
            const ratingOrder = (a.rating ?? -1) - (b.rating ?? -1); //-1 if unrated
            return ratingOrder || a.name.localeCompare(b.name); // sort by name if both unrated/same rating
         });
         break;
   }

   return (
      <section className={styles.collection}>

         <div className={styles.toolbar}>
            <GameSearch value={search} onSearchChange={setSearch} />
            <GameSort value={sortBy} onSortChange={setSortBy} />

            <div className={styles['action-buttons']}>

               <AddGame onGameAdded={onGamesChanged}/>

               <button
                  className='action-button'
                  type="button"
                  onClick={() => setIsDeleteMode(!isDeleteMode)}
               >
                  {isDeleteMode ? "Done" : "Delete"}
               </button>
            </div>

         </div>
         
         <div className={styles['list-container']}>
            <ul className={styles['game-list']}>
               {visibleGames.map((game) => (
                  <li id={styles['game-item']} key={game.id}>
                     {isDeleteMode && (
                        <DeleteGame 
                           gameId={game.id}
                           onDeleted={onGamesChanged}
                           gameName={game.name}
                        />
                     )}
                     <GameCard game={game} isDeleteMode={isDeleteMode}/>
                  </li>
               ))}
            </ul>
         </div> 
      </section>
   );
}