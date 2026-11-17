import type { CsrfToken } from '../types/index.ts';
import { readJson } from './apiUtils.ts';

// GET: Fetch the CSRF token to send with mutating requests
export async function getCsrfToken(): Promise<CsrfToken> {
   
   const response = await fetch("http://localhost:8080/api/auth/csrf",
      {
         credentials: 'include'
      }
   );

   return readJson<CsrfToken>(response, 'Could not retrieve CSRF token');
}