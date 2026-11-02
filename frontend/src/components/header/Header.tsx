import LogoutButton from "./LogoutButton.tsx";

type HeaderProps = {
    onLogout: () => void;
}

export default function Header({ onLogout }: HeaderProps) {
    return (
        <>
            <h1>Game Journal</h1>
            <LogoutButton onLogout={onLogout} />
        </>
    );
}