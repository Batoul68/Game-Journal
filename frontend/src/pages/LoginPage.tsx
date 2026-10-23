import { useState } from "react";

import LoginForm from "../components/LoginPageComponents/LoginForm.tsx";

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
        <>
            <h1>Welcome to Game Journal!</h1>

            <button onClick={handleLoginButton}>Login</button>
            <button onClick={handleCreateButton}>Create Account</button>
      
            {showLoginForm && <LoginForm onLoginSuccess={onLoginSuccess}/>}
        </>
    );
}