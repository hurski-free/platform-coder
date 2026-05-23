import { IEngine } from "./engine/IEngine";
import { IFrameView } from "./FrameView";
import { IGameSession } from "./GameSession";
import { IRender } from "./render/IRender";
import { GameWorld } from "./world/GameWorld";

/**
 * non-optimized game class
 * For SoA just use number for indexes
 */
export class Game {
  private readonly world: GameWorld;
  private readonly engine: IEngine;
  private readonly renderer: IRender;
  private readonly frameView: IFrameView;
  private readonly gameSession: IGameSession;

  protected animationFrameId: number = 0;
  protected _prevTimestamp: DOMHighResTimeStamp = 0;

  constructor(
    world: GameWorld,
    engine: IEngine,
    renderer: IRender,
    frameView: IFrameView,
    gameSession: IGameSession,
  ) {
    this.world = world;
    this.engine = engine;
    this.renderer = renderer;
    this.frameView = frameView;
    this.gameSession = gameSession;
  }

  get gameState() {
    return this.gameSession.gameState;
  }

  start() {
    if (this.gameSession.gameState === 'wait_for_start') {
      this.gameSession.gameState = 'running';

      this.frameView.camera[0] = -this.frameView.halfWidth;
      this.frameView.camera[1] = -this.frameView.halfHeight;

      this._prevTimestamp = performance.now();
      this.animationFrameId = requestAnimationFrame((now) => this.tick(now));
    }
  }

  tick(now: DOMHighResTimeStamp) {
    if (this.gameSession.gameState === 'running') {
      const deltaTime = now - this._prevTimestamp;
      this._prevTimestamp = now;

      if (deltaTime > 200) {
        // ignore cycle
        this.animationFrameId = requestAnimationFrame((now) => this.tick(now));
      } else {
        this.engine.process(this.world, this.frameView, this.gameSession);
        this.renderer.render(this.world, this.frameView, this.gameSession);
        this.animationFrameId = requestAnimationFrame((now) => this.tick(now));
      }
    }
  }

  pause() {
    if (this.gameSession.gameState === 'running') {
      this.gameSession.gameState = 'paused';
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = 0;
    }
  }

  resume() {
    if (this.gameSession.gameState === 'paused') {
      this.gameSession.gameState = 'running';

      this._prevTimestamp = performance.now();
      this.animationFrameId = requestAnimationFrame((now) => this.tick(now));
    }
  }

  stop() {
    if (this.gameSession.gameState !== 'wait_for_start') {
      this.gameSession.gameState = 'wait_for_start';
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = 0;
      this.world.clear();
      this.renderer.render(this.world, this.frameView, this.gameSession);
    }
  }

  restart() {
    this.stop();
    this.start();
  }

  resizeCanvas(width: number, height: number, cameraSet = false) {
    this.frameView.width = width;
    this.frameView.height = height;
    this.frameView.halfWidth = width / 2;
    this.frameView.halfHeight = height / 2;

    if (cameraSet) {
      this.frameView.camera[0] = -this.frameView.halfWidth;
      this.frameView.camera[1] = -this.frameView.halfHeight;
    }
  }

  cameraMove(deltaX: number, deltaY: number) {
    this.frameView.camera[0] -= deltaX;
    this.frameView.camera[1] -= deltaY;

    if (this.gameSession.gameState === 'paused') {
      this.renderer.render(this.world, this.frameView, this.gameSession);
    }
  }
}
