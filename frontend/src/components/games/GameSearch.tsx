
type GameSearchProps = {
   value: string;
   onSearchChange: (value: string) => void;
}

export default function GameSearch({ value, onSearchChange }: GameSearchProps) {

   const handleSearch = (event: React.SubmitEvent<HTMLFormElement>) => {
      event.preventDefault();
      console.log(value);
   }

   return(
      <form onSubmit={handleSearch}>
         <input 
            value={value}
            onChange={(e) => onSearchChange(e.target.value)}
            type="text"
            placeholder="Search"
         />
         <button type="submit">Search</button>
      </form>

   );
}