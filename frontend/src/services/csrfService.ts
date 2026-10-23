import type { CsrfToken } from '../types/index.ts';

// GET: Fetch the CSRF token to send with mutating requests
export async function getCsrfToken(): Promise<CsrfToken> {
    
    const csrfResponse = await fetch("http://localhost:8080/api/auth/csrf",
        {
            credentials: 'include'
        }
    );

    if (!csrfResponse.ok) {
        throw new Error('Could not retrieve CSRF token');
    }

    return csrfResponse.json();
}