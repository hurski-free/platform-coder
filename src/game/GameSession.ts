export type GameState = 'wait_for_start' | 'running' | 'paused';

export interface IGameSession {
  gameState: GameState;
  score: number;
}

export type ImmutableGameSession = Readonly<IGameSession>;
