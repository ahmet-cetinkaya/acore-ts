import type PaginationResult from "../PaginationResult";

export type SortDirection = "asc" | "desc";

export interface Sort<T> {
  key: keyof T;
  direction: SortDirection;
}

export interface IListable<T> {
  getAll(predicate?: (x: T) => boolean | Promise<boolean>, sort?: Sort<T> | Sort<T>[]): Promise<T[]>;
  getList(
    pageIndex: number,
    pageSize: number,
    predicate?: (x: T) => boolean | Promise<boolean>,
    sort?: Sort<T> | Sort<T>[],
  ): Promise<PaginationResult<T>>;
}

export interface ICountable<T> {
  count(predicate?: (x: T) => boolean | Promise<boolean>): Promise<number>;
}

export interface IGettable<T> {
  get(predicate: (x: T) => boolean | Promise<boolean>): Promise<T | null>;
}

export interface IAddable<T> {
  add(item: T): Promise<void>;
}

export interface IUpdatable<T> {
  update(item: T): Promise<void>;
}

export interface IRemovable<T> {
  remove(predicate: (x: T) => boolean | Promise<boolean>): Promise<void>;
}

export interface IRepository<T>
  extends IListable<T>,
    ICountable<T>,
    IGettable<T>,
    IAddable<T>,
    IUpdatable<T>,
    IRemovable<T> {}
