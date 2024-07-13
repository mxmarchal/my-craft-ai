export type Element = {
  label: string;
  emoji: string;
};

export function isElement(element: Element): element is Element {
  return (element as Element).label !== undefined;
}
