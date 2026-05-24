/** Проверка ответа игрока на задачу платформы */
export interface IVerify {
  verify(answer: string): boolean;
}
