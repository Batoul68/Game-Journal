import type { CsrfToken } from '../types/index.ts';
import { getCsrfToken } from './csrfService.ts';

const authEndpoint = 'http://localhost:8080/api/auth';

// GET: Check for authenticated backend session
export async function checkSession(): Promise<boolean> {
    const response = await fetch(`${authEndpoint}/me`, {
        credentials: 'include'
    });

    // Authenticated session
    if (response.ok) {
        return true;
    }

    // Unauthenticated session
    if (response.status === 401) {
        return false;
    }

    throw new Error('Could not check session');
}

// POST: Login, sending user credentials to backend
export async function login(username: string, password: string): Promise<void> {

    // GET: fetch csrf token to send with login credentials
    const csrf: CsrfToken = await getCsrfToken();

    // Login
    const response = await fetch(`${authEndpoint}/login`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            [csrf.headerName]: csrf.token
        },
        body: new URLSearchParams({ username, password })
    });

    if (!response.ok) {
        throw new Error('Could not send credentials to login');
    }
}

// POST: Logout, sending user credentials to backend
export async function logout(): Promise<void> {

    // GET: fetch csrf token 
    const csrf: CsrfToken = await getCsrfToken();

    // Logout
    const response = await fetch(`${authEndpoint}/logout`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            [csrf.headerName]: csrf.token
        }
    });

    if (!response.ok) {
        throw new Error('Could not logout');
    }
}

// POST: Create a new account
export async function createAccount(username: string, password: string): Promise<void> {

    // GET: fetch csrf token
    const csrf: CsrfToken = await getCsrfToken();

    // Create a new account
    const response = await fetch(`${authEndpoint}/register`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            [csrf.headerName]: csrf.token
        },
        body: JSON.stringify({ username, password })
    });

    if (response.status === 409) {
        throw new Error('Username already taken');
    }

    if (!response.ok) {
        throw new Error('Unable to create account');
    }
}

