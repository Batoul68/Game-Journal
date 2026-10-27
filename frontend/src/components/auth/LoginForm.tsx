import { useState } from 'react';
import { login } from '../../services/authService.ts';

type LoginFormProps = {
    onLoginSuccess: () => void;
}

export default function LoginForm({ onLoginSuccess }: LoginFormProps) {

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
            setLoginMessage('Login failed');
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
                <button type="submit">Login</button>
            </form>

            <h4>{loginMessage}</h4>
        </div>
        
    );
}