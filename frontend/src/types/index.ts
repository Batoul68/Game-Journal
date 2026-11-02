export interface Game {
  id: number;
  name: string;
  coverImageUrl: string;
};

export interface CsrfToken {
    token: string;
    headerName: string;
    parameterName: string;
};