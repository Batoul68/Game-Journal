import LogoutButton from "./LogoutButton.tsx";

type HeaderProps = {
    onLogout: () => void;
}

export default function Header({ onLogout }: HeaderProps) {
    return (
        <>
            <LogoutButton onLogout={onLogout} />
        </>
    );
}