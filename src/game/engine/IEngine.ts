import type { ImmutableFrameView } from "../FrameView";
import type { IGameSession } from "../GameSession";
import { GameWorld } from "../world/GameWorld";

export interface IEngine {
  process(world: GameWorld, frameView: ImmutableFrameView, session: IGameSession, deltaTime: number): void;

  onPlatformSolved(world: GameWorld, session: IGameSession): void;
}