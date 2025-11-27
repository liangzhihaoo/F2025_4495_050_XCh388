// Shared pagination types for services

export type PageRequest = {
  page: number;
  pageSize: number;
  filters?: any;
  sort?: any;
};

export type PageResponse<T> = {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
};
