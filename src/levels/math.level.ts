import type { ILevel, ILevelPlatform } from "../game/level/ILevel";
import { createIntUniqueArray, rndInt } from "../utils/generators";
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

function createMultiplicationPlatform(mul1Digits: number, mul2Digits: number): ILevelPlatform {
  const mul1 = rndInt(mul1Digits);
  const mul2 = rndInt(mul2Digits);

  return {
    kind: 'text_match',
    prompt: `${mul1} * ${mul2} = ?`,
    expected: mul1 * mul2,
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

function createNumbersWithDelimiter(length: number, min: number, max: number, delimeter: number) {
  const numbers = createIntUniqueArray(length, min, max);

  const processed = numbers.map((number) => {
    if (number % delimeter !== 0) {
      return Math.random() < 0.5 ? number * delimeter : number;
    }
    return Math.random() < 0.5 ? number / delimeter : number;
  });

  return processed;
}

function createMathLevel(): ILevel {
  const incrreasingArray = createIcreasingArray(5, -30, 30);
  const incrreasingBlocks = incrreasingArray.map((value) => ({ id: value.toString(), text: value.toString() }));

  const decreasingArray = createDecreasingArray(5, -30, 30);
  const decreasingBlocks = decreasingArray.map((value) => ({ id: value.toString(), text: value.toString() }));

  const numberDividedBy3 = createNumbersWithDelimiter(7, -1000, 1000, 3);
  const numberDividedBy3Blocks = numberDividedBy3.map((value) => ({ id: value.toString(), text: value.toString() }));
  const numberDividedBy3Expected = numberDividedBy3.filter((value) => value % 3 === 0).map((value) => value.toString());

  const numberDividedBy5 = createNumbersWithDelimiter(7, -1000, 1000, 5);
  const numberDividedBy5Blocks = numberDividedBy5.map((value) => ({ id: value.toString(), text: value.toString() }));
  const numberDividedBy5Expected = numberDividedBy5.filter((value) => value % 5 === 0).map((value) => value.toString());

  return {
    platforms: [
      ...Array.from({ length: 2 }).map(() => createSumPlatform(1)),
      ...Array.from({ length: 2 }).map(() => createSumPlatform(2)),
      ...Array.from({ length: 1 }).map(() => createSumPlatform(3)),
      ...Array.from({ length: 2 }).map(() => createSubtractionPlatform(1)),
      ...Array.from({ length: 2 }).map(() => createSubtractionPlatform(2)),
      ...Array.from({ length: 3 }).map(() => createMultiplicationPlatform(2, 1)),
      ...Array.from({ length: 1 }).map(() => createMultiplicationPlatform(2, 2)),
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
      {
        kind: 'block_build',
        prompt: 'Соберите числа, которые делятся на 3:',
        blocks: numberDividedBy3Blocks,
        expected: numberDividedBy3Expected,
      },
      {
        kind: 'block_build',
        prompt: 'Соберите числа, которые делятся на 5:',
        blocks: numberDividedBy5Blocks,
        expected: numberDividedBy5Expected,
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
