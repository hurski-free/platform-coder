import { ImmutableFrameView } from "../FrameView";
import { IGameSession } from "../GameSession";
import { GameWorld } from "../world/GameWorld";

export interface IEngine {
  process(world: GameWorld, frameView: ImmutableFrameView, session: IGameSession, deltaTime: number): void;

  // other methods inside engine class
}