export interface IQueryResult<T> {
  size: number;
  page: number;
  total: number;
  list: T[];
}
