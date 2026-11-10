import { useState } from 'react';
import { login } from '../../services/authService.ts';
import styles from './AuthForm.module.css';

type LoginFormProps = {
   onLoginSuccess: () => void;
   onShowSignUp: () => void;
}

export default function LoginForm({ onLoginSuccess, onShowSignUp }: LoginFormProps) {

   const [username, setUsername] = useState('');
   const [password, setPassword] = useState('');
   const [loginMessage, setLoginMessage] = useState('');

   const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
      e.preventDefault();
      try {
         await login(username, password);
         onLoginSuccess();
      } catch (error) {
         console.error(error);
         setLoginMessage(
            error instanceof Error ? error.message : 'Could not login, please try again.'
         );
      } finally {
         setUsername('');
         setPassword('');
      }
   }

   return(
      <div className={styles.container}>
         <div className={styles['form-area']}>
            <p className={styles.title}>LOGIN</p>
            <form action="" onSubmit={handleSubmit}>
                  <div className={styles['form-group']}>
                     <label className={styles.subtitle}>Username</label>
                     <input 
                        placeholder="Enter your username" 
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className={styles['form-style']}
                        type="text"
                     />
                  </div>
                  <div className={styles['form-group']}>
                     <label className={styles.subtitle}>Password</label>
                     <input 
                        placeholder="Enter your password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        id="password" 
                        className={styles['form-style']} 
                        type="password"
                     />
                  </div>
                  <div>
                     <button type="submit" className={styles['auth-button']}>LOGIN</button>
                     <p id={styles.footer}>
                        Not registered? 
                        <a 
                           className={styles.link} 
                           href="signup"
                           onClick={(e) => {
                              e.preventDefault();
                              onShowSignUp();
                           }}
                        >
                           Sign up here!
                        </a>
                     </p>
                  </div>
            </form>
         </div>
         
         <h3 id={styles.message}>{loginMessage}</h3>
      </div>
   );
}