import { createReducer } from "@ngrx/store";
import { initialTestState } from "./test.state";
import { mutableOn } from "ngrx-etc";
import TestActions from "./test.action";

const testReducer = createReducer(
  initialTestState,

  mutableOn(TestActions.create, (state) => {
    state.isSubmitting = true,
    state.submitStatus = "pending"
  }),
  mutableOn(TestActions.createSuccess, (state, { test }) => {
    state.isSubmitting = false,
    state.submitStatus = "success",
    state.createdData = {
      ...state.createdData,
      test
    }
  }),
  mutableOn(TestActions.createFailure, (state) => {
    state.isSubmitting = false,
    state.submitStatus = "error"
  }),

  mutableOn(TestActions.getListTestPartsSuccess, (state, { parts }) => {
    state.testParts = parts;
  }),

  mutableOn(TestActions.setSelectedTestPartId, (state, { id }) => {
    state.selectedTestPartId = id;
  })
);

export default testReducer;