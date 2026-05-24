export type GameState = 'wait_for_start' | 'running' | 'paused' | 'finished';

export type LevelOutcome = 'none' | 'won' | 'lost';

export interface IGameSession {
  gameState: GameState;
  score: number;
  levelOutcome: LevelOutcome;
}

export type ImmutableGameSession = Readonly<IGameSession>;
