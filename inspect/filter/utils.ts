// Color for console. The first one has the highest priority, whichs showed at the bottom
export enum Color {
  Red = 'red',
  Orange = 'orange',
  Green = 'green',
  Cyan = 'cyan',
}

// Structure of an error item
export class FatalError {
  constructor(
    public title: string,
    public txtRegList: RegExp[],
  ) {}
}

/**
 * Print colorful message
 */
export function consoleColor(color: Color, ...args: any[]) {
  const colorMap = new Map<Color, string>([
    [Color.Red, '\x1b[91m'],
    [Color.Orange, '\x1b[38;5;208m'],
    [Color.Green, '\x1b[32m'],
    [Color.Cyan, '\x1b[36m'],
  ]);
  return console.log(colorMap.get(color), ...args);
}
