import { createFeatureSelector, createSelector } from "@ngrx/store";
import { CategoryState } from "./category.state";

export const selectCategory = createFeatureSelector<CategoryState>("category");

export const CategorySelect = {
  loading: createSelector(selectCategory, (state: CategoryState) => state.loading),
  categories: createSelector(selectCategory, (state: CategoryState) => state.categories),
  isSubmitting: createSelector(selectCategory, (state: CategoryState) => state.isSubmitting),
  submitStatus: createSelector(selectCategory, (state: CategoryState) => state.submitStatus),
}