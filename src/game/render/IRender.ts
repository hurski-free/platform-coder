import type { ImmutableFrameView } from "../FrameView";
import type { ImmutableGameSession } from "../GameSession";
import { GameWorld } from "../world/GameWorld";
import type { Translator } from "../../i18n";

export interface IRender {
  readonly translator: Translator;

  render(world: GameWorld, frameView: ImmutableFrameView, session: ImmutableGameSession): void;

  // other methods inside render class
}