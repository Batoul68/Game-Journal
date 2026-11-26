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
   playStatus: PlayStatus;
   playModes: PlayMode[];
   playTime: number | null;
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
   imageUrl: string | null;
   title: string;
}

export interface JournalEntryValues {
   targetGameId: number;
   body: string;
   imageFile: File | null;
   title: string;
}

export type PlayStatus = 
   'NOT_SET' |
   'NOT_STARTED' |
   'CURRENTLY_PLAYING' |
   'ON_HOLD' |
   'FINISHED';

export type PlayMode = 'SINGLE_PLAYER' | 'CO_OP' | 'ONLINE_MULTIPLAYER';