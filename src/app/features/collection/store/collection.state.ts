import { PaginatedList, SubmitStatus } from "@shared/models/common";
import { CollectionSearch, CollectionTableItem } from "../models/collection.model";

export interface CollectionState {
  table: PaginatedList<CollectionTableItem>,
  loadingTable: boolean,
  isSubmitting: boolean;
  submitStatus: SubmitStatus;
  search: CollectionSearch;
  selectedCollectionId: number;
}

export const initialCollectionState: CollectionState = {
  table: {} as PaginatedList<CollectionTableItem>,
  loadingTable: false,
  isSubmitting: false,
  submitStatus: "idle",
  search: {},
  selectedCollectionId: 0
}