import { IColumn } from "./IColumn";

export interface ITable {
  getKey(): string;
  getName(): string;
  getColumns(): IColumn[];
  select<T>(record: Record<string, unknown>): Promise<T[]>;
  count(): Promise<number>;
  insert<T>(record: Record<string, unknown>): Promise<T | null>;
  update<T>(record: Record<string, unknown>): Promise<T | null>;
  delete<T>(record: Record<string, unknown>): Promise<T | null>;
  query<T>(queryLisp: string): Promise<T | null>;
  lock(): Promise<void>;
  unlock(): Promise<void>;
}
