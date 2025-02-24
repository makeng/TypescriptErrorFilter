export function createBEM(name: string) {
  return (el?: string, modifier?: string) => {
    if (!el) {
      return name;
    }
    if (modifier) {
      return `${name}__${el}--${modifier}`;
    }
    return `${name}__${el}`;
  };
}
