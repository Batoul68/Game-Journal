import type { Game } from '../types/index.ts';
import { getCsrfToken } from './csrfService.ts';

const API = 'http://localhost:8080/api/games'

// GET: Loading saved list of games 
export async function getGames(): Promise<Game[]> {
    const response = await fetch(API,
      {
        credentials: 'include'
      }
    );

    if (!response.ok) {
      throw new Error('Backend returned an error');
    }

    const data = await response.json();

    return data;
}

// POST: Creating a new game 
export async function createGame(name: string): Promise<Game> {

  // GET: fetch csrf token to send with POST
  const csrf = await getCsrfToken();

  const response = await fetch(API, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      [csrf.headerName]: csrf.token
    },
    body: JSON.stringify({
      name: name.trim()
    })
  });

  if (!response.ok) {
    throw new Error('Unable to add game');
  }

  return response.json();
}
