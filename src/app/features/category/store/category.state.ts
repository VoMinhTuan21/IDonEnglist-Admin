import { SubmitStatus } from "../../../shared/models/common";
import { Category } from "../models/category.model";

export interface CategoryState {
  categories: Category[];
  loading: boolean;
  isSubmitting: boolean;
  submitStatus: SubmitStatus;
}

export const initialCategoryState: CategoryState = {
  categories: [],
  loading: false,
  isSubmitting: false,
  submitStatus: "idle"
}