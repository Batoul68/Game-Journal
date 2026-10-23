import { logout } from "../../services/authService.ts";

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
        <button onClick={handleLogout}>Logout</button>
    );
}