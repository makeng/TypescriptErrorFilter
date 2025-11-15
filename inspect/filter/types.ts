// Color for console. The first one has the highest priority, whichs showed at the bottom in the CLI, and the top of the UI
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
