import { Status, Priority } from "./enum";

// Interface & optional
export interface Todo {
  id: string;
  title: string;
  status: Status;
  priority?: Priority;
  createdAt: Date;
}

// Union, Intersection & Type alias
export type ID = string | number;                          // union
export type WithTimestamps = { createdAt: Date; updatedAt: Date };
export type Entity = { id: string } & WithTimestamps;      // intersection

export type Result<T> = { ok: true; data: T } | { ok: false; error: string };
export type SearchParams = { query: string } & { page?: number; size?: number };
