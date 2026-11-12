import type { SortBy } from "./GameCollection/GameCollection";

type GameSortProps = {
   value: SortBy;
   onSortChange: (value: SortBy) => void;
};

export default function GameSort({ value, onSortChange }: GameSortProps) {

   return(
      <label>
         Sort by
         <select
            value={value}
            onChange={(e) => onSortChange(e.target.value as SortBy)}
         >
            <option value="recently added">Recently added</option>
            <option value="oldest added">Oldest added</option> 
            <option value="title a-z">Title A-Z</option>
            <option value="title z-a">Title Z-A</option>
            <option value="highest rating">Highest rated</option>
            <option value="lowest rating">Lowest rated</option>
         </select>
      </label>
   );
}