import { useState, useEffect, useCallback } from 'react';
import type { Game, JournalEntry } from '../types';
import { getDlcs, getGameById } from '../services/gameService';
import { getJournalEntries } from '../services/journalEntryService';

export default function useGameDetails(gameId: string | undefined) {

   const [game, setGame] = useState<Game | null>(null);
   const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
   const [dlcs, setDlcs] = useState<Game[]>([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState('');

   useEffect(() => {
      let ignore = false;

      const loadDetails = async () => {
         setLoading(true);
         setError('');
         setGame(null);
         setJournalEntries([]);
         setDlcs([]);

         const numericGameId = Number(gameId);

         if (!gameId || !Number.isSafeInteger(numericGameId) || numericGameId <= 0) {
            setError('Invalid game ID');
            setLoading(false);
            return;
         }

         try {
            const [loadedGame, loadedEntries, loadedDlcs] = await Promise.all([
               getGameById(gameId),
               getJournalEntries(numericGameId),
               getDlcs(numericGameId)
            ]);

            if (!ignore) {
               setGame(loadedGame);
               setJournalEntries(loadedEntries);
               setDlcs(loadedDlcs);
            }
         } catch (error) {
            if (!ignore) {
               setError(
                  error instanceof Error
                  ? error.message
                  : 'Could not load game details'
               );
            }
         } finally {
            if (!ignore) {
               setLoading(false);
            }
         }

         void loadDetails();

         return () => {
            ignore = true;
         }
      }
   }, [gameId]);

   // Journal entry methods
   const reloadEntries = useCallback(async () => {
      const loadedEntries = await getJournalEntries(Number(gameId));
      setJournalEntries(loadedEntries);
   }, [gameId]);

   const handleEntryUpdated = (updatedEntry: JournalEntry) => {
      setJournalEntries((current) => 
         current.map((entry) => 
            entry.id === updatedEntry.id ? updatedEntry : entry
         )
      );
   }

   const handleEntryDeleted = (entryId: number) => {
      setJournalEntries((current) =>
         current.filter((entry) => entry.id !== entryId)
      );
   }

   // DLC method
   const reloadDlcs = useCallback(async () => {
      const loadedDlcs = await getDlcs(Number(gameId));
      setDlcs(loadedDlcs);
   }, [gameId]);

   return {
      game,
      journalEntries,
      dlcs,
      loading,
      error,
      setGame,
      reloadEntries,
      reloadDlcs,
      handleEntryUpdated,
      handleEntryDeleted
   }
}