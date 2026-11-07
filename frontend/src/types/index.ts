export interface Game {
   id: number;
   name: string;
   coverImageUrl: string;
   rating: number;
   genre: string;
   review: string;
};

export interface GameFormValues {
   name: string;
   coverImageUrl: string;
   rating: number | null;
   genre: string;
   review: string;
};

export interface CsrfToken {
   token: string;
   headerName: string;
   parameterName: string;
};

export interface SessionUser {
   username: string;
}