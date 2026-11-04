export interface Game {
  id: number;
  name: string;
  coverImageUrl: string;
  rating: number;
  genre: string;
  review: string;
};

export interface CsrfToken {
    token: string;
    headerName: string;
    parameterName: string;
};