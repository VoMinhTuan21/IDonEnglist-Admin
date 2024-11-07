import { PaginatedList, SubmitStatus } from "@shared/models/common";
import { CollectionTableItem } from "../models/collection.model";

export interface CollectionState {
  table: PaginatedList<CollectionTableItem>,
  loadingTable: boolean,
  isSubmitting: boolean;
  submitStatus: SubmitStatus;
}

export const initialCollectionState: CollectionState = {
  table: {} as PaginatedList<CollectionTableItem>,
  loadingTable: false,
  isSubmitting: false,
  submitStatus: "idle"
}