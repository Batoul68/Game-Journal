import { useState } from "react";
import { createAccount } from "../../services/authService.ts";
import styles from './AuthForm.module.css';

export default function CreateAccountForm({ onShowLogin }: { onShowLogin: () => void}) {

   const [username, setUsername] = useState('');
   const [password, setPassword] = useState('');
   const [retypePassword, setRetypePassword] = useState('');
   const [message, setMessage] = useState('');

   const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
      e.preventDefault();
      setMessage('');

      // Send POST to backend
      try {
         // Error handling
         if (!username.trim()) {
            setMessage('Username cannot be empty');
            return;
         }

         if (username.trim().length < 3) {
            setMessage('Username should be 3 or more characters');
            return;
         }
      
         if (!password) {
            setMessage('Password cannot be empty');
            return;
         }

         if (retypePassword !== password) {
            setMessage("Passwords don't match");
            return;
         }
         await createAccount(username, password);
         setMessage('Account created! Try logging in.');

      } catch (error) {
         console.error(error);
         setMessage(
               error instanceof Error 
               ? error.message
               : 'An error occured creating your account'
         );
      } finally {
         setUsername('');
         setPassword('');
         setRetypePassword('');
      }
   }

   return(
      <div className={styles.container}>
         <div className={styles['form-area']}>
            <p className={styles.title}>SIGN UP</p>
            <form action="" onSubmit={handleSubmit}>
                  <div className={styles['form-group']}>
                     <label className={styles.subtitle}>Username</label>
                     <input 
                        placeholder="Enter a username" 
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className={styles['form-style']}
                        type="text"
                     />
                  </div>
                  <div className={styles['form-group']}>
                     <label className={styles.subtitle}>Password</label>
                     <input 
                        placeholder="Enter a password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        id="password" 
                        className={styles['form-style']} 
                        type="password"
                     />
                  </div>
                  <div className={styles['form-group']}>
                     <label className={styles.subtitle}>Verify Password</label>
                     <input 
                        placeholder="Re-enter password" 
                        value={retypePassword}
                        onChange={(e) => setRetypePassword(e.target.value)}
                        id="retype-password" 
                        className={styles['form-style']} 
                        type="password"
                     />
                  </div>
                  <div>
                     <button type="submit" className={styles['auth-button']}>SIGN UP</button>
                     <p id={styles.footer}>
                        Already registered? 
                        <a 
                           className={styles.link} 
                           href="login"
                           onClick={(e) => {
                              e.preventDefault();
                              onShowLogin();
                           }}
                        >
                           Login here!
                        </a>
                     </p>
                  </div>
            </form>
         </div>
         
         <h3 id={styles.message}>{message}</h3>
      </div>
   );

}