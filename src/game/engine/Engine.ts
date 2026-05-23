import { ImmutableFrameView } from "../FrameView";
import { IGameSession } from "../GameSession";
import { GameWorld } from "../world/GameWorld";
import { IEngine } from "./IEngine";

export class Engine implements IEngine {
  process(world: GameWorld, frameView: ImmutableFrameView, session: IGameSession, deltaTime: number): void {
    // TODO: implement engine process

    void world;
    void frameView;
    void session;
    void deltaTime;
  }
}