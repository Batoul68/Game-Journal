
export const gameTabs = [
   {id: 'overview', label: 'Overview'},
   {id: 'dlc', label: 'DLC'},
   {id: 'journal', label: 'Journal'},
   {id: 'gallery', label: 'Gallery'}
] as const;
   
export type GameTab = (typeof gameTabs)[number]['id'];

type GameTabsProps = {
   activeTab: GameTab;
   onTabChange: (tab: GameTab) => void;
};

export default function GameTabs({ activeTab, onTabChange }: GameTabsProps) {
   return(
      <div role="group" aria-label="Game sections">
         {gameTabs.map(({id, label}) => (
            <button
               key={id}
               type="button"
               aria-pressed={activeTab === id}
               onClick={() => onTabChange(id)}
            >
               {label}
            </button>

         ))}
      </div>
   );
}