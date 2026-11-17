
// Helper method
export async function readJson<T>(response: Response, errorMessage: string): Promise<T> {
   if (!response.ok) {
      throw new Error(`${errorMessage} (${response.status})`);
   }

   return response.json();
}