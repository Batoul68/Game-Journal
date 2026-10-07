import type { Game } from '../types/index.ts';

const API = 'http://localhost:8080/api/games'

export async function getGames(): Promise<Game[]> {
    const response = await fetch(API, {
      credentials: "include"
    });

    if (!response.ok) {
      throw new Error('Backend returned an error');
    }

    const data = await response.json();

    return data;
};

export async function createGame(name: string): Promise<Game> {
  const response = await fetch(API, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: name.trim()
    })
  });

  if (!response.ok) {
    throw new Error('Unable to add game');
  }

  return response.json();
};
