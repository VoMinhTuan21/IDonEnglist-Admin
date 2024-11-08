import { FileModel, PaginationRequest } from "@shared/models/common";

export interface CollectionTableItem {
  id: number;
  name: string;
  code: string;
  thumbnail: string;
  categoryId: number;
}

export interface GetPaginationCollectionRequest extends PaginationRequest {
  categoryId?: number;
  keywords?: string;
}

export type CreateCollectionRequest = Pick<CollectionTableItem , "name" | "categoryId"> & {
  thumbnail: FileModel
}

export type UpdateCollectionRequest = Partial<CreateCollectionRequest> & {
  id: number;
}