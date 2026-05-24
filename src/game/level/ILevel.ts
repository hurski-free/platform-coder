import type { PlatformTaskKind } from "../tasks/IPlatformTask";
import type { TextMatchExpected } from "../tasks/TextMatchTask";

export interface ILevelPlatform {
  kind: PlatformTaskKind;
  prompt: string;
  expected: TextMatchExpected;
}
export interface ILevel {
  platforms: ILevelPlatform[];
}