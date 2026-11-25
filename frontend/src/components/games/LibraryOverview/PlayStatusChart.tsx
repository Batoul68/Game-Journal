import type { Game } from "../../../types";
import { Pie, PieChart, Tooltip, ResponsiveContainer } from 'recharts';
import styles from './LibraryOverview.module.css';

const statuses = [
   { value: 'FINISHED', label: 'Finished', color: '#38539d' },
   { value: 'CURRENTLY_PLAYING', label: 'Currently playing', color: '#4f83e3' },
   { value: 'ON_HOLD', label: 'On hold', color: '#83a5e2' },
   { value: 'NOT_STARTED', label: 'Not started', color: '#bccff1' },
   { value: 'NOT_SET', label: 'Not set', color: '#aeb5c0' },
] as const;

export default function PlayStatusChart({ games }: { games: Game[] }) {

   const data = statuses.map(({ value, label, color }) => ({
      label,
      color,
      count: games.filter((game) =>
         (game.playStatus ?? 'NOT_SET') === value
      ).length
   })).filter(({ count }) => count > 0);

   const hasGames = data.length > 0;
   const pieData = hasGames ? data : [{ label: 'Empty library', count: 1, color: '#e8edf5' }];

   return(
      <article className={styles.card}>
         <h2>Play status</h2>

         <div className={styles['status-layout']}>
            <div className={styles['pie-plot']}>
               <ResponsiveContainer width="100%" height={160}>
                  <PieChart>
                     <Pie
                        data={pieData}
                        dataKey="count"
                        nameKey="name"
                        label
                        outerRadius="90%"
                        startAngle={90}
                        endAngle={-270}
                        stroke="#fff"
                        strokeWidth={2}
                        isAnimationActive={hasGames ? 'auto' : false}
                        animationBegin={0}
                        animationDuration={750}
                        animationEasing="ease-out"
                     />
                     {hasGames && <Tooltip />}
                  </PieChart>
               </ResponsiveContainer>
            </div>
         </div>
      </article>
   );
}