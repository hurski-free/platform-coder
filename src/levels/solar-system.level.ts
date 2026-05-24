import type { ILevel } from "../game/level/ILevel";
import type { ILevelDefinition } from "./level-definition";

const solarSystemLevel: ILevel = {
  platforms: [
    {
      kind: 'text_match',
      prompt: 'Сколько планет в Солнечной системе?',
      expected: 8,
    },
    {
      kind: 'text_match',
      prompt: 'Самая большая планета в Солнечной системе?',
      expected: 'Юпитер',
    },
    {
      kind: 'text_match',
      prompt: 'Номер планеты с самыми большими кольцами?',
      expected: 6,
    },
    {
      kind: 'text_match',
      prompt: 'Какая планета находится ближе всего к Солнцу?',
      expected: 'Меркурий',
    },
    {
      kind: 'text_match',
      prompt: 'Какая планета находится дальше всего от Солнца?',
      expected: 'Нептун',
    },
    {
      kind: 'text_match',
      prompt: '"Радиокативная" планета?',
      expected: 'Уран',
    },
    {
      kind: 'text_match',
      prompt: 'На какой планете сутки носят название "сол"?',
      expected: 'Марс',
    },
    {
      kind: 'text_match',
      prompt: 'Спутник какой планеты называется "Фобос"?',
      expected: 'Марс',
    },
    {
      kind: 'text_match',
      prompt: 'Спутник какой планеты называется "Деймос"?',
      expected: 'Марс',
    },
    {
      kind: 'text_match',
      prompt: 'Карликовая планета после Нептуна?',
      expected: 'Плутон',
    },
    {
      kind: 'text_match',
      prompt: 'Самый большой спутник Юпитера?',
      expected: 'Ганимед',
    },
    {
      kind: 'text_match',
      prompt: 'Спутник сатурна и по совместительству металл с высокой прочностью?',
      expected: 'Титан',
    },
    {
      kind: 'text_match',
      prompt: 'Планета с самой высокой температурой на поверхности?',
      expected: 'Венера',
    },
  ],
};

export const levelDefinition: ILevelDefinition = {
  id: 'solar-system',
  titleKey: 'levels.solarSystem.title',
  descriptionKey: 'levels.solarSystem.description',
  getLevel: () => solarSystemLevel,
};
