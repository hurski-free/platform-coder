import type { IPlatformTask, PlatformTaskKind } from "./IPlatformTask";
import { TextMatchTask, type TextMatchExpected } from "./TextMatchTask";

export interface ITaskCreateConfig {
  kind: PlatformTaskKind;
  prompt: string;
  expected: TextMatchExpected;
}

export function createTask(config: ITaskCreateConfig): IPlatformTask {
  switch (config.kind) {
    case 'text_match':
      return new TextMatchTask(config.prompt, config.expected);
  }
}