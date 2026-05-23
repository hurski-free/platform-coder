import { Translator } from "../../i18n";
import { ImmutableFrameView } from "../FrameView";
import { ImmutableGameSession } from "../GameSession";
import { GameWorld } from "../world/GameWorld";
import { IRender } from "./IRender";

interface IRenderCreateConfig {
  ctx: CanvasRenderingContext2D;
  translator: Translator;
}

export class Render implements IRender {
  private readonly ctx: CanvasRenderingContext2D;
  readonly translator: Translator;

  constructor(cfg: IRenderCreateConfig) {
    this.ctx = cfg.ctx;
    this.translator = cfg.translator;
  }

  render(world: GameWorld, frameView: ImmutableFrameView, session: ImmutableGameSession): void {
    // TODO: implement render

    void world;
    void frameView;
    void session;
    void this.ctx;
  }
}