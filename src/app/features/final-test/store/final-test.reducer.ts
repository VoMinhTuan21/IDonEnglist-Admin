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
  }),

  mutableOn(FinalTestActions.update, (state) => {
    state.submitStatus = 'pending';
    state.isSubmitting = true;
  }),
  mutableOn(FinalTestActions.updateSuccess, (state) => {
    state.submitStatus = 'success';
    state.isSubmitting = false;
  }),
  mutableOn(FinalTestActions.updateFailure, (state) => {
    state.submitStatus = 'error';
    state.isSubmitting = false;
  }),

  mutableOn(FinalTestActions.setSearch, (state, { search }) => {
    state.search = search;
  }),

  mutableOn(FinalTestActions.setSelectedFinalTest, (state, { id }) => {
    state.selectedFinalTestId = id;
  }),

  mutableOn(FinalTestActions.remove, (state) => {
    state.isSubmitting = true;
    state.submitStatus = "pending";
  }),
  mutableOn(FinalTestActions.removeSuccess, (state) => {
    state.isSubmitting = false;
    state.submitStatus = "success";
  }),
  mutableOn(FinalTestActions.removeFailure, (state) => {
    state.isSubmitting = false;
    state.submitStatus = "error";
  })
);

export default finalTestReducer;