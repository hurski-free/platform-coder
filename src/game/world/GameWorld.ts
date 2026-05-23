import type { IWorld } from "./IWorld";

export interface IWorldCreateConfig {
  // TODO: world create config here, if necessary
}

export class GameWorld implements IWorld {
  // TODO: world objects here

  constructor(cfg: IWorldCreateConfig) {
    void cfg;
  }

  clear(): void {
  }

  freeMemory(): void {
  }
}