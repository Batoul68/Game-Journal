import { useState } from "react";

import LoginForm from "../../components/auth/LoginForm.tsx";
import CreateAccountForm from "../../components/auth/CreateAccountForm.tsx";
import styles from './LoginPage.module.css';

type LoginPageProps = {
   onLoginSuccess: () => void;
}

export default function LoginPage({ onLoginSuccess }: LoginPageProps) {

   const [showLoginForm, setShowLoginForm] = useState(false);
   const [showCreateForm, setShowCreateForm] = useState(false);

   const handleLoginButton = () => {
      setShowLoginForm(!showLoginForm);
      setShowCreateForm(false);
   }

   const handleCreateButton = () => {
      setShowCreateForm(!showCreateForm);
      setShowLoginForm(false);
   }

   return(
      <div>
         <h1 className={styles.title}>Welcome to your Game Journal!</h1>

         <div className={styles['auth-actions']}>
            <button className='auth-button' onClick={handleLoginButton}>Login</button>
            <button  className='auth-button' onClick={handleCreateButton}>Create Account</button>
         </div>
         
         {showLoginForm && <LoginForm onLoginSuccess={onLoginSuccess}/>}
         {showCreateForm && <CreateAccountForm />}
      </div>
   );
}