import type { Game, GameFormValues } from '../types/index.ts';
import { getCsrfToken } from './csrfService.ts';

const API = 'http://localhost:8080/api/games';

// Helper method
async function readJson<T>(response: Response, errorMessage: string): Promise<T> {
   if (!response.ok) {
      throw new Error(`${errorMessage} (${response.status})`);
   }

   return response.json();
}

// GET: Loading saved list of games 
export async function getGames(): Promise<Game[]> {
   const response = await fetch(API, {
      credentials: 'include'
      });

   return readJson<Game[]>(response, 'Could not fetch the games');
}

// GET: Game by id
export async function getGameById(gameId: string): Promise<Game> {
   const response = await fetch(`${API}/${gameId}`, {
      credentials: 'include'
   });

   return readJson<Game>(response, 'Could not fetch game');
}

// GET: DLCs by parent game id
export async function getDlcs(parentGameId: number): Promise<Game[]> {
   const response = await fetch(`${API}/${parentGameId}/dlcs`, {
      credentials: 'include'
   });

   return readJson<Game[]>(response, 'Could not fetch DLCs');
}

// POST: Creating a new game 
export async function createGame(values: GameFormValues): Promise<Game> {

   // GET: fetch csrf token to send with POST
   const csrf = await getCsrfToken();

   const response = await fetch(API, {
      method: 'POST',
      credentials: 'include',
      headers: {
         'Content-Type': 'application/json',
         [csrf.headerName]: csrf.token
      },
      body: JSON.stringify(values)
   });

   return readJson<Game>(response, 'Unable to add game');
}

// POST: Creating a DLC
export async function createDlc(parentGameId: number, values: GameFormValues): Promise<Game> {

   // GET: fetch csrf token
   const csrf = await getCsrfToken();

   const response = await fetch(`${API}/${parentGameId}/dlcs`, {
      method: 'POST',
      credentials: 'include',
      headers: {
         'Content-Type': 'application/json',
         [csrf.headerName]: csrf.token
      },
      body: JSON.stringify(values)
   });

   return readJson<Game>(response, 'Unable to add dlc');
}

// PUT: Editing a game
export async function updateGame(gameId: string, values: GameFormValues): Promise<Game> {

   // GET: fetch csrf token
   const csrf = await getCsrfToken();

   const response = await fetch(`${API}/${gameId}`, {
      method: 'PUT',
      credentials: 'include',
      headers: {
         'Content-Type': 'application/json',
         [csrf.headerName]: csrf.token
      },
      body: JSON.stringify(values)
   });

   return readJson<Game>(response, 'Could not update game');
}

// DELETE: Delete a game
export async function deleteGame(gameId: number): Promise<void> {

   // GET: fetch csrf token
   const csrf = await getCsrfToken();

   const response = await fetch(`${API}/${gameId}`, {
      method: 'DELETE',
      credentials: 'include',
      headers: {
         [csrf.headerName]: csrf.token
      }
   });

   if (!response.ok) {
      throw new Error(`Could not delete game (${response.status})`);
   }
}
