import { PaginatedList, SubmitStatus } from "@shared/models/common";
import { FinalTestTableItem } from "../models/final-test.model";

export interface FinalTestState {
  table: PaginatedList<FinalTestTableItem>,
  loadingTable: boolean,
  isSubmitting: boolean,
  submitStatus: SubmitStatus
}

export const initialFinalTestState: FinalTestState = {
  table: {} as PaginatedList<FinalTestTableItem>,
  loadingTable: false,
  isSubmitting: false,
  submitStatus: "idle"
}