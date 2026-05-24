import type { Translator } from "../i18n";
import type { ILevel } from "./level/ILevel";
import type { IFrameView } from "./FrameView";
import type { IGameSession } from "./GameSession";
import { GameWorld } from "./world/GameWorld";
import { Engine } from "./engine/Engine";
import { Render } from "./render/Render";
import { Game } from "./Game";


export function createGame(
  ctx: CanvasRenderingContext2D,
  translator: Translator,
  level: ILevel,
) {
  if (!(ctx instanceof CanvasRenderingContext2D)) {
    throw new Error('ctx must be a CanvasRenderingContext2D');
  }

  const frameView = {
    width: ctx.canvas.width,
    height: ctx.canvas.height,
    halfWidth: ctx.canvas.width / 2,
    halfHeight: ctx.canvas.height / 2,
    camera: [0, 0],
  } satisfies IFrameView;

  const gameSession = {
    gameState: 'wait_for_start',
    score: 0,
    levelOutcome: 'none',
  } satisfies IGameSession;
  
  const render = new Render({ ctx, translator });
  const world = new GameWorld({});
  world.buildLevel(level);
  world.layoutForCanvasWidth(frameView.width);

  const engine = new Engine();

  return new Game(world, engine, render, frameView, gameSession, level);
}