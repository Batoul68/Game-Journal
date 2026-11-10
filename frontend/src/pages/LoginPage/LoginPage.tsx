import { useState } from "react";


import LoginForm from "../../components/auth/LoginForm.tsx";
import CreateAccountForm from "../../components/auth/CreateAccountForm.tsx";
import styles from './LoginPage.module.css';

type LoginPageProps = {
   onLoginSuccess: () => void;
}

export default function LoginPage({ onLoginSuccess }: LoginPageProps) {

   const [view, setView] = useState<"login" | "signup">("login");


   return(
      <div>
         <h1 className={styles.title}>Welcome to your Game Journal!</h1>

         {view === "login" ? (
            <LoginForm 
               onLoginSuccess={onLoginSuccess} 
               onShowSignUp={() => setView("signup")}
            />
         ) : (
            <CreateAccountForm 
               onShowLogin={() => setView("login")}
            />
         )}
      </div>
   );
}