import type { JournalEntry, JournalEntryValues } from "../types";
import { readJson } from "./apiUtils";
import { getCsrfToken } from "./csrfService";

const API = 'http://localhost:8080/api/games';

// GET: Journal entries from base game id
export async function getJournalEntries(baseGameId: number): Promise<JournalEntry[]>{
   const response = await fetch(`${API}/${baseGameId}/journal-entries`, {
      credentials: 'include'
   });

   return readJson<JournalEntry[]>(response, 'Could not fetch journal entries');
}

// POST: Add journal entry to base game or its DLCs
export async function createJournalEntry(baseGameId: number, values: JournalEntryValues): Promise<JournalEntry> {
   
   // GET: fetch csrf token to send with POST
   const csrf = await getCsrfToken();
   
   const response = await fetch(`${API}/${baseGameId}/journal-entries`, {
      method: 'POST',
      credentials: 'include',
      headers: {
         'Content-Type': 'application/json',
         [csrf.headerName]: csrf.token
      },
      body: JSON.stringify(values)
   });

   return readJson<JournalEntry>(response, 'Unable to add journal entry');
}

// PUT: Edit a journal entry
export async function updateJournalEntry(
   baseGameId: number,
   entryId: number,
   values: JournalEntryValues
): Promise<JournalEntry> {

   const csrf = await getCsrfToken();

   const response = await fetch(`${API}/${baseGameId}/journal-entries/${entryId}`, {
      method: 'PUT',
      credentials: 'include',
      headers: {
         'Content-Type': 'application/json',
         [csrf.headerName]: csrf.token
      },
      body: JSON.stringify(values)
   });

   return readJson<JournalEntry>(response, 'Unable to update journal entry');
}

// DELETE: Delete a journal entry
export async function deleteJournalEntry(baseGameId: number, entryId: number): Promise<void> {
   const csrf = await getCsrfToken();

   const response = await fetch(`${API}/${baseGameId}/journal-entries/${entryId}`, {
      method: 'DELETE',
      credentials: 'include',
      headers: {
         [csrf.headerName]: csrf.token
      }
   });

   if (!response.ok) {
      throw new Error(`Unable to delete journal entry (${response.status})`);
   }
}