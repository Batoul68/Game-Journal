import type { CsrfToken } from '../types/index.ts';
import { getCsrfToken } from './csrfService.ts';

const authEndpoint = 'http://localhost:8080/api/auth';

// POST: Sending user credentials to Spring Security backend
export async function login(username: string, password: string): Promise<Response> {

    // GET: fetch csrf token to send with login credentials
    const csrf: CsrfToken = await getCsrfToken();

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
        throw new Error('Could not send credentials');
    }

    return response;
}

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