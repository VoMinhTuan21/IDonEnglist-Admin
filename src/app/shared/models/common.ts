export interface Token {
  token: string;
  refreshToken: string;
}

export interface Breadcrumb {
  label: string,
  url: string
}

export type SubmitStatus = "idle" | "success" | "error";

export interface PaginationRequest {
  [key: string] : any;
  sortBy?: string;
  ascending?: boolean;
  withDeleted?: boolean;
  pageNumber?: number;
  pageSize?: number;
}

export interface PaginatedList<T> {
  items: Array<T>;
  pageIndex: number;
  pageSize: number;
  totalPages: number;
  totalRecords: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}