
export type PagedResponse<T> = {
  items: T[];
  page: number;
  pageSize: number;
  totalPages: number;
  totalCount: number;
};

export const emptyPagedResponse = <T,>(): PagedResponse<T> => ({
  items: [],
  page: 1,
  pageSize: 0,
  totalPages: 1,
  totalCount: 0,
})

