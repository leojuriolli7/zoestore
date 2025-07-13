export declare namespace API {
  type InfiniteListResult<T> = {
    results: T[];
    nextCursor: number | null;
  };
}
