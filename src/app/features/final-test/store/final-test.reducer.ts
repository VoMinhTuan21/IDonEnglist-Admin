import { createReducer } from "@ngrx/store";
import { initialFinalTestState } from "./final-test.state";
import { mutableOn } from "ngrx-etc";
import FinalTestActions from "./final-test.action";

const finalTestReducer = createReducer(
  initialFinalTestState,

  mutableOn(FinalTestActions.getPagination, (state) => {
    state.loadingTable = true;
  }),
  mutableOn(FinalTestActions.getPaginationSuccess, (state, {response}) => {
    state.loadingTable = false;
    state.table = response
  }),
  mutableOn(FinalTestActions.getPaginationFailure, (state) => {
    state.loadingTable = false;
  }),

  mutableOn(FinalTestActions.create, (state) => {
    state.isSubmitting = true;
    state.submitStatus = 'pending';
  }),
  mutableOn(FinalTestActions.createSuccess, (state) => {
    state.isSubmitting = false;
    state.submitStatus = 'success';
  }),
  mutableOn(FinalTestActions.createFailure, (state) => {
    state.isSubmitting = false;
    state.submitStatus = 'error';
  }),

  mutableOn(FinalTestActions.resetSubmitStatus, (state) => {
    state.submitStatus = "idle";
  })
);

export default finalTestReducer;