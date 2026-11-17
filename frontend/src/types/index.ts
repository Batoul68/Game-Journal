export interface Game extends GameFormValues{
   id: number;
   parentGameId: number | null;
};

export interface GameFormValues {
   name: string;
   coverImageUrl: string;
   rating: number | null;
   genres: string[];
   review: string;
   releaseYear: number | null;
   description: string;
};

export interface CsrfToken {
   token: string;
   headerName: string;
   parameterName: string;
};

export interface SessionUser {
   username: string;
};

export interface GameMetadataResponse {
   igdbId: number;
   name: string;
   coverImageUrl: string | null;
   releaseYear: number | null;
   genres: string[];
   summary: string | null;
   storyline: string | null;
}

export interface JournalEntry {
   id: number;
   gameId: number;
   body: string;
   createdAt: string;
}

export interface JournalEntryValues {
   targetGameId: number;
   body: string;
}