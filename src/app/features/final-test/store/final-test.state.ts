import { PaginatedList, SubmitStatus } from "@shared/models/common";
import { FinalTestSearch, FinalTestTableItem } from "../models/final-test.model";

export interface FinalTestState {
  table: PaginatedList<FinalTestTableItem>,
  loadingTable: boolean,
  isSubmitting: boolean,
  submitStatus: SubmitStatus,
  search: FinalTestSearch,
  selectedFinalTestId: number,
}

export const initialFinalTestState: FinalTestState = {
  table: {} as PaginatedList<FinalTestTableItem>,
  loadingTable: false,
  isSubmitting: false,
  submitStatus: "idle",
  search: {},
  selectedFinalTestId: 0
}