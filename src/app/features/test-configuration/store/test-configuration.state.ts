import { PaginatedList, SubmitStatus } from "@shared/models/common";
import { ITestTypeTableItem } from "../models/test-configuration";

export interface TestConfigurationState {
  table: PaginatedList<ITestTypeTableItem>,
  loading: boolean;
  isSubmitting: boolean;
  submitStatus: SubmitStatus
}

export const initialTestConfigurationState: TestConfigurationState = {
  table: {
    hasNextPage: false,
    hasPreviousPage: false,
    items: [],
    pageIndex: 1,
    pageSize: 10,
    totalPages: 0,
    totalRecords: 0
  },
  loading: false,
  isSubmitting: false,
  submitStatus: "idle"
}