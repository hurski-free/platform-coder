import type { ILevel } from '../game/level/ILevel';
import type { ILevelDefinition } from './level-definition';

const levelModules = import.meta.glob<{ levelDefinition: ILevelDefinition }>('./*.level.ts', {
  eager: true,
});

export const levelDefinitions: ILevelDefinition[] = Object.values(levelModules)
  .map((mod) => mod.levelDefinition)
  .filter((def): def is ILevelDefinition => def != null)
  .sort((a, b) => a.id.localeCompare(b.id));

export function getLevelDefinition(id: string): ILevelDefinition | undefined {
  return levelDefinitions.find((def) => def.id === id);
}

export function getLevelById(id: string): ILevel | undefined {
  return getLevelDefinition(id)?.getLevel();
}
