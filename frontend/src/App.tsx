import { useEffect, useState } from "react";
import LoginForm from "./components/LoginForm";
import GamePage from "./pages/GamesPage";
import {
  getCurrentUser,
  logout,
  type CurrentUser,
} from "./services/authService";

export default function App() {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function checkLogin() {
      try {
        setUser(await getCurrentUser());
      } catch {
        setMessage("Could not reach the backend. Refresh to try again.");
      } finally {
        setLoading(false);
      }
    }

    void checkLogin();
  }, []);

  async function handleLoggedIn() {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      throw new Error("Login could not be confirmed.");
    }

    setUser(currentUser);
    setMessage("");
  }

  async function handleLogout() {
    try {
      await logout();
      setUser(null);
      setMessage("");
    } catch {
      setMessage("Could not log out. Please try again.");
    }
  }

  if (loading) {
    return <p>Checking your login...</p>;
  }

  if (!user) {
    return (
      <>
        {message && <p role="alert">{message}</p>}
        <LoginForm onLoggedIn={handleLoggedIn} />
      </>
    );
  }

  return (
    <>
      <p>Logged in as {user.username}</p>
      <button onClick={handleLogout}>Log out</button>
      {message && <p role="alert">{message}</p>}
      <GamePage />
    </>
  );
}