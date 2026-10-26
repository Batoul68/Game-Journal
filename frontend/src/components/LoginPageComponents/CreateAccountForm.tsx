import { useState } from "react";
import { createAccount } from "../../services/authService.ts";

export default function CreateAccountForm() {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [retypePassword, setRetypePassword] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        setMessage('');

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

        // Send POST to backend
        try {
            await createAccount(username, password);
            setMessage('Account created! Try logging in.');

        } catch (error) {
            console.error(error);
            setMessage(
                error instanceof Error 
                ? error.message
                : 'An error occured creating your account'
            );
        }
    }

    return(
        <div>
            <form onSubmit={handleSubmit}>
                <input 
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input 
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <input 
                    type="password"
                    placeholder="Retype Password"
                    value={retypePassword}
                    onChange={(e) => setRetypePassword(e.target.value)}
                />
                <button type="submit">Create Account</button>
            </form>

            <h4>{message}</h4>
        </div>
    );

}