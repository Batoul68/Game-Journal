
import { useState } from "react";
import { login } from "../services/authService";

type LoginFormProps = {
  onLoggedIn: () => Promise<void>;
};

export default function LoginForm({ onLoggedIn }: LoginFormProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setSubmitting(true);

    try {
      await login(username, password);
      setPassword("");
      await onLoggedIn();
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h1>Log in to your game journal</h1>

      <label htmlFor="username">Username</label>
      <input
        id="username"
        autoComplete="username"
        value={username}
        onChange={(event) => setUsername(event.target.value)}
        required
      />

      <label htmlFor="password">Password</label>
      <input
        id="password"
        type="password"
        autoComplete="current-password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        required
      />

      <button type="submit" disabled={submitting}>
        {submitting ? "Logging in..." : "Log in"}
      </button>

      {message && <p role="alert">{message}</p>}
    </form>
  );
}