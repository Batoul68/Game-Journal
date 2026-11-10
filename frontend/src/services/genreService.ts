
const API = 'http://localhost:8080/api/genres';

// GET: all genre options
export async function getGenreOptions(): Promise<string[]> {
   const response = await fetch(`${API}`, {
      credentials: 'include'
   });

   if (!response.ok) {
      throw new Error(`Could not load genres (${response.status})`);
   }

   return response.json();
}