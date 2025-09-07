import { Status } from "./enum";

// Functions & signatures
export type BinaryOp = (a: number, b: number) => number;
export const add: BinaryOp = (a, b) => a + b;

// Advanced Type System: union + narrowing
export function idAsString(id: string | number): string {
  return typeof id === "string" ? id : String(id);
}

// Literal-driven flow (discriminated union ringan via Status)
export function nextStatus(s: Status): Status {
  if (s === Status.NEW) return Status.IN_PROGRESS;
  if (s === Status.IN_PROGRESS) return Status.DONE;
  return Status.DONE;
}

// Generics
export function paginate<T>(items: T[], page = 1, size = 5) {
  const start = (page - 1) * size;
  return { data: items.slice(start, start + size), total: items.length, page, size };
}
