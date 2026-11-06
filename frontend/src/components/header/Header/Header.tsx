import LogoutButton from "../LogoutButton/LogoutButton.tsx";
import styles from './Header.module.css'

type HeaderProps = {
   onLogout: () => void;
}

export default function Header({ onLogout }: HeaderProps) {
   return (
      <div className={styles['header-container']}>
         <h1 id={styles.title}>Game Journal</h1>
         <div id={styles.logout}>
            <LogoutButton onLogout={onLogout}/>
         </div>
         
      </div>
   );
}