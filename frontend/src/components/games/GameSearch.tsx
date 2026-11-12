
type GameSearchProps = {
   value: string;
   onSearchChange: (value: string) => void;
}

export default function GameSearch({ value, onSearchChange }: GameSearchProps) {

   return(
         <input 
            value={value}
            onChange={(e) => onSearchChange(e.target.value)}
            type="text"
            placeholder="Search"
         />
   );
}