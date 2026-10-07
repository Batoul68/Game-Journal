const API_URL = "http://localhost:8080";

type CsrfToken = {
    headerName: string;
    token: string;
};

export type CurrentUser = {
    username: string;
};

async function getCsrfToken(): Promise<CsrfToken> {
    const response = await fetch(`${API_URL}/api/auth/csrf`, {
        credentials: "include"
    });

    if (!response.ok) {
        throw new Error("Could not prepare the request");
    }

    return response.json();
}

export async function login(username: string, password: string): Promise<void> {
    const csrf = await getCsrfToken();

    const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            [csrf.headerName]: csrf.token
        },
        body: new URLSearchParams({
            username,
            password
        })
    });

    if (response.status === 401) {
        throw new Error("Incorrect username or password");
    }

    if (!response.ok) {
        throw new Error("Login failed. Please try again");
    }
}

export async function getCurrentUser(): Promise<CurrentUser | null> {
    const response = await fetch(`${API_URL}/api/auth/me`, {
        credentials: "include"
    });

    if (response.status === 401) {
        return null;
    }

    if (!response.ok) {
        throw new Error("Could not check your login");
    }

    return response.json();
}

export async function logout(): Promise<void> {
    const csrf = await getCsrfToken();

    const response = await fetch(`${API_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
        headers: {
            [csrf.headerName]: csrf.token
        }
    });

    if (!response.ok) {
        throw new Error("Logout failed. Please try again");
    }
}

export async function getCsrfHeaders(): Promise<Record<string, string>> {
    const csrf = await getCsrfToken();

    return {
        [csrf.headerName]: csrf.token
    };
}