import type { Game } from "../../../types";
import PlayStatusChart from "./PlayStatusChart";

export default function LibraryOverview({ games }: { games:Game[] }) {

   return(
      <PlayStatusChart games={games} />
   );
}