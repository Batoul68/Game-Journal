import type { CsrfToken } from '../types/index.ts';
import { getCsrfToken } from './csrfService.ts';

// POST: Sending user credentials to Spring Security backend
export async function login(username: string, password: string) {

    // GET: fetch csrf token to send with login credentials
    const csrf: CsrfToken = await getCsrfToken();

    const response = await fetch('http://localhost:8080/api/auth/login', {
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