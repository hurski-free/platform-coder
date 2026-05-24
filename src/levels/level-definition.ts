import type { ILevel } from '../game/level/ILevel';

export interface ILevelDefinition {
  id: string;
  titleKey: string;
  descriptionKey?: string;
  getLevel(): ILevel;
}
