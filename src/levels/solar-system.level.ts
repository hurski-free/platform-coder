import type { ILevel } from "../game/level/ILevel";
import type { ILevelDefinition } from "./level-definition";

function createSolarSystemLevel(): ILevel {
  const jupiterSatellites = [
    { id: 'io', text: 'Ио' },
    { id: 'europa', text: 'Европа' },
    { id: 'ganymede', text: 'Ганимед' },
    { id: 'callisto', text: 'Каллисто' },
  ];
  const nonJupiterSatellites = [
    { id: 'titan', text: 'Титан' },
    { id: 'phobos', text: 'Фобос' },
    { id: 'charon', text: 'Харон' },
  ];
  const jupiterSatellitesBlocks = jupiterSatellites.concat(nonJupiterSatellites);

  return {
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
        prompt: '"Радиоактивная" планета?',
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
      {
        kind: 'block_sequence',
        prompt: 'Расположите планеты от самых близких к самым удалённым от Солнца:',
        blocks: [
          { id: 'mercury', text: 'Меркурий' },
          { id: 'earth', text: 'Земля' },
          { id: 'mars', text: 'Марс' },
          { id: 'uranus', text: 'Уран' },
          { id: 'neptune', text: 'Нептун' },
        ],
        expected: ['mercury', 'earth', 'mars', 'uranus', 'neptune'],
      },
      {
        kind: 'block_sequence',
        prompt: 'Расположите планеты от самых дальних к самым близким к Солнцу:',
        blocks: [
          { id: 'saturn', text: 'Сатурн' },
          { id: 'jupiter', text: 'Юпитер' },
          { id: 'venus', text: 'Венера' },
          { id: 'earth', text: 'Земля' },
        ],
        expected: ['saturn', 'jupiter', 'earth', 'venus'],
      },
      {
        kind: 'block_build',
        prompt: 'Соберите спутники Юпитера:',
        blocks: jupiterSatellitesBlocks,
        expected: jupiterSatellites.map((satellite) => satellite.id),
      },
    ],
  };
}

export const levelDefinition: ILevelDefinition = {
  id: 'solar-system',
  titleKey: 'levels.solarSystem.title',
  descriptionKey: 'levels.solarSystem.description',
  getLevel: createSolarSystemLevel,
};
