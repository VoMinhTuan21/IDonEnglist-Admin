import { CollectionMin } from '@features/collection/models/collection.model';
import { PaginationRequest } from '@shared/models/common';

export interface FinalTestTableItem {
  id: number;
  name: string;
  code: string;
  collection: CollectionMin;
}

export interface GetPaginationFinalTestsRequest extends PaginationRequest {
  collectionId?: number;
  keywords?: string;
  forCreateTest?: boolean;
}

export type CreateFinalTestRequest = Pick<FinalTestTableItem, 'name'> & {
  collectionId: number;
}

export type UpdateFinalTestRequest = CreateFinalTestRequest & {
  id: number;
}

export type FinalTestSearch = {
  keywords?: string;
  collectionId?: number;
}

export type FinalTestMin = Omit<FinalTestTableItem, "collection">;