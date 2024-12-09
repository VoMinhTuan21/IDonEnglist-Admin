import { createFeatureSelector, createSelector } from "@ngrx/store";
import { TestState } from "./test.state";

export const selectTest = createFeatureSelector<TestState>("test");

export const TestSelect = {
  isSubmitting: createSelector(selectTest, (state: TestState) => state.isSubmitting),
  submitStatus: createSelector(selectTest, (state: TestState) => state.submitStatus),
  createdTest: createSelector(selectTest, (state: TestState) => state.createdData),
  testParts: createSelector(selectTest, (state: TestState) => state.testParts),
  selectedTestPartId: createSelector(selectTest, (state: TestState) => state.selectedTestPartId),
}