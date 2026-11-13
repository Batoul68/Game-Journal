import type { GameMetadataResponse } from "../types/index.ts";

const API = 'http://localhost:8080/api/game-metadata/search';

// GET: IGDB search the title and get the matching games
export async function searchGameMetadata(title: string): Promise<GameMetadataResponse[]> {

   const params = new URLSearchParams({ title });

   const response = await fetch(`${API}?${params}`, {
      credentials: 'include'
   });

   if (!response.ok) {
      throw new Error(`Could not load genres (${response.status})`);
   }

   return response.json();
}