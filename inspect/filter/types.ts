// Color for console. The first one has the highest priority, whichs showed at the bottom
export enum Color {
  Red = '\x1b[91m',
  Orange = '\x1b[38;5;208m',
  Green = '\x1b[32m',
  Cyan = '\x1b[36m',
}

interface Config {
  title: string;
  color: Color;
  /** 不区分大小写 */
  matchCase?: boolean;
}

// Structure of an error item
export interface FatalError {
  txtRegList: RegExp[];
  config: Config;
}
