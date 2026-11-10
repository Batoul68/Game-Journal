import type { Game } from '../types/index.ts';
import { getCsrfToken } from './csrfService.ts';

const API = 'http://localhost:8080/api/games';

// GET: Loading saved list of games 
export async function getGames(): Promise<Game[]> {
   const response = await fetch(API, {
      credentials: 'include'
      });

   if (!response.ok) {
      throw new Error(`Could not fetch the games (${response.status})`);
   }

   const data = await response.json();
   return data;
}

// GET: Game by id
export async function getGameById(gameId: string): Promise<Game> {
   const response = await fetch(`${API}/${gameId}`, {
      credentials: 'include'
   });

   if (!response.ok) {
      throw new Error(`Could not fetch game (${response.status})`);
   }

   const data = await response.json();
   return data;

}

// POST: Creating a new game 
export async function createGame(
   name: string, 
   coverImageUrl: string,
   rating: number | null,
   genre: string,
   review: string,
   releaseYear: number | null,
   description: string
): Promise<Game> {

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
         name: name.trim(),
         coverImageUrl: coverImageUrl.trim(),
         rating,
         genre,
         review,
         releaseYear,
         description
      })
   });

   if (!response.ok) {
      throw new Error(`Unable to add game (${response.status})`);
   }

   return response.json();
}

// PUT: Editing a game
export async function updateGame(
   gameId: string,
   name: string,
   coverImageUrl: string,
   rating: number | null,
   genre: string,
   review: string,
   releaseYear: number | null,
   description: string
): Promise<Game> {

   // GET: fetch csrf token
   const csrf = await getCsrfToken();

   const response = await fetch(`${API}/${gameId}`, {
      method: 'PUT',
      credentials: 'include',
      headers: {
         'Content-Type': 'application/json',
         [csrf.headerName]: csrf.token
      },
      body: JSON.stringify({
         name: name.trim(),
         coverImageUrl: coverImageUrl.trim(),
         rating,
         genre,
         review,
         releaseYear,
         description
      })
   });

   if(!response.ok) {
      throw new Error(`Could not update game (${response.status})`);
   }

   return response.json();
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
