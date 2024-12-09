import { SubmitStatus } from "@shared/models/common";
import { TestMinViewModel } from "../models/test.model";
import { TestPart } from "@features/test-part/models/test-part.model";

export interface TestState {
  isSubmitting: boolean;
  submitStatus: SubmitStatus;
  createdData: {
    test: TestMinViewModel
  } | undefined,
  testParts: TestPart[],
  selectedTestPartId: number,
}

export const initialTestState: TestState = {
  isSubmitting: false,
  submitStatus: "idle",
  createdData: undefined,
  testParts: [],
  selectedTestPartId: 0,
}