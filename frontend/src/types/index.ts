export interface Game  extends GameFormValues{
   id: number;
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
   summary: string | null;
   storyline: string | null;
}