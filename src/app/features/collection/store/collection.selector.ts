import { createFeatureSelector, createSelector } from "@ngrx/store";
import { CollectionState } from "./collection.state";

export const selectCollection = createFeatureSelector<CollectionState>("collection");

export const CollectionSelect = {
  loadingTable: createSelector(selectCollection, (state: CollectionState) => state.loadingTable),
  table: createSelector(selectCollection, (state: CollectionState) => state.table),
  isSubmitting: createSelector(selectCollection, (state: CollectionState) => state.isSubmitting),
  submitStatus: createSelector(selectCollection, (state: CollectionState) => state.submitStatus)
}