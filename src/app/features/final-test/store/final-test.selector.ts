import { createFeatureSelector, createSelector, select } from "@ngrx/store";
import { FinalTestState } from "./final-test.state";

export const selectFinalTest = createFeatureSelector<FinalTestState>("finalTest");

export const FinalTestSelect = {
  loadingTable: createSelector(selectFinalTest, (state: FinalTestState) => state.loadingTable),
  table: createSelector(selectFinalTest, (state: FinalTestState) => state.table),
  isSubmitting: createSelector(selectFinalTest, (state: FinalTestState) => state.isSubmitting),
  submitStatus: createSelector(selectFinalTest, (state: FinalTestState) => state.submitStatus),
  search: createSelector(selectFinalTest, (state: FinalTestState) => state.search),
  selectedFinalTestId: createSelector(selectFinalTest, (state: FinalTestState) => state.selectedFinalTestId)
}