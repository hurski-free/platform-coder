import type { ILevel, ILevelPlatform } from "../game/level/ILevel";
import { createIntUniqueArray, rndInt, rng } from "../utils/generators";
import type { ILevelDefinition } from "./level-definition";

function createSumPlatform(digits: number): ILevelPlatform {
  const a = rndInt(digits);
  const b = rndInt(digits);

  return {
    kind: 'text_match',
    prompt: `${a} + ${b} = ?`,
    expected: a + b,
  };
}

function createSubtractionPlatform(digits: number): ILevelPlatform {
  const a = rndInt(digits);
  const b = rndInt(digits);

  return {
    kind: 'text_match',
    prompt: `${a} - ${b} = ?`,
    expected: a - b,
  };
}

function createMultiplicationPlatform(digits: number): ILevelPlatform {
  const a = rndInt(digits);
  const b = rndInt(digits);

  return {
    kind: 'text_match',
    prompt: `${a} * ${b} = ?`,
    expected: a * b,
  };
}

function createDivisionPlatform(resultDigits: number, dividerDigits: number): ILevelPlatform {
  const result = rndInt(resultDigits);
  const divider = rndInt(dividerDigits, true);

  const dividend = result * divider;

  return {
    kind: 'text_match',
    prompt: `${dividend} / ${divider} = ?`,
    expected: result,
  };
}

function createIcreasingArray(length: number, min: number, max: number) {
  return createIntUniqueArray(length, min, max);
}

function createDecreasingArray(length: number, min: number, max: number) {
  return createIntUniqueArray(length, min, max).reverse();
}

function createMathLevel(): ILevel {
  const incrreasingArray = createIcreasingArray(5, 1, 10);
  const incrreasingBlocks = incrreasingArray.map((value) => ({ id: value.toString(), text: value.toString() }));

  const decreasingArray = createDecreasingArray(5, 1, 10);
  const decreasingBlocks = decreasingArray.map((value) => ({ id: value.toString(), text: value.toString() }));

  return {
    platforms: [
      ...Array.from({ length: 2 }).map(() => createSumPlatform(1)),
      ...Array.from({ length: 2 }).map(() => createSumPlatform(2)),
      ...Array.from({ length: 1 }).map(() => createSumPlatform(3)),
      ...Array.from({ length: 2 }).map(() => createSubtractionPlatform(1)),
      ...Array.from({ length: 2 }).map(() => createSubtractionPlatform(2)),
      ...Array.from({ length: 3 }).map(() => createMultiplicationPlatform(1)),
      ...Array.from({ length: 1 }).map(() => createMultiplicationPlatform(2)),
      ...Array.from({ length: 2 }).map(() => createDivisionPlatform(1, 1)),
      ...Array.from({ length: 2 }).map(() => createDivisionPlatform(2, 1)),
      {
        kind: 'block_sequence',
        prompt: 'Расположите числа в порядке возрастания:',
        blocks: incrreasingBlocks,
        expected: incrreasingBlocks.map((block) => block.id),
      },
      {
        kind: 'block_sequence',
        prompt: 'Расположите числа в порядке убывания:',
        blocks: decreasingBlocks,
        expected: decreasingBlocks.map((block) => block.id),
      },
    ],
  };
}

export const levelDefinition: ILevelDefinition = {
  id: 'math',
  titleKey: 'levels.math.title',
  descriptionKey: 'levels.math.description',
  getLevel: createMathLevel,
};
