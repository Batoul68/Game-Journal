import { logout } from "../../../services/authService.ts";
import styles from './LogoutButton.module.css';

type LogoutButtonProps = {
   onLogout: () => void;
}

export default function LogoutButton({ onLogout }: LogoutButtonProps) {

   const handleLogout = async () => {
      try {
         await logout();
         onLogout();
      } catch (error) {
         console.error('Could not logout', error);
      }
   }

   return(
      <button className={styles.button} onClick={handleLogout}>Logout</button>
   );
}