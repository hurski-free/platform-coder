/** Ответ игрока: текст или упорядоченный список id блоков */
export type TaskAnswer = string | readonly string[];

/** Проверка ответа игрока на задачу платформы */
export interface IVerify {
  verify(answer: TaskAnswer): boolean;
}
