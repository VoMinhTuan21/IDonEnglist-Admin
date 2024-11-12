export interface Token {
  token: string;
  refreshToken: string;
}

export interface Breadcrumb {
  label: string,
  url: string
}

export type SubmitStatus = "idle" | "pending" | "success" | "error";

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
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  totalRecords: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface FileModel {
  publicId: string;
  url: string;
}