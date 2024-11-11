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
}

export type CreateFinalTestRequest = Pick<FinalTestTableItem, 'name'> & {
  collectionId: number;
}