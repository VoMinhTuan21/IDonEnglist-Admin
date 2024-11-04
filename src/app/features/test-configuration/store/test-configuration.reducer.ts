import { createReducer } from "@ngrx/store";
import { initialTestConfigurationState } from "./test-configuration.state";
import { mutableOn } from "ngrx-etc";
import { TestConfigurationActions } from "./test-configuration.action";

const testConfigurationReducer = createReducer(
  initialTestConfigurationState,

  mutableOn(TestConfigurationActions.create, (state) => {
    state.isSubmitting = true;
    state.submitStatus = "idle"
  }),
  mutableOn(TestConfigurationActions.createSuccess, (state, {type, ...createdData}) => {
    state.isSubmitting = false;
    state.submitStatus = "success";
    state.table.items.push(createdData);
  }),
  mutableOn(TestConfigurationActions.createFailure, (state) => {
    state.isSubmitting = false;
    state.submitStatus = "error"
  }),

  mutableOn(TestConfigurationActions.getPagination, (state) => {
    state.loading = true;
  }),
  mutableOn(TestConfigurationActions.getPaginationSuccess, (state, {type, ...paginatedList}) => {
    state.loading = false;
    state.table = paginatedList;
  }),
  mutableOn(TestConfigurationActions.getPaginationFailure, (state) => {
    state.loading = false;
  }),

  mutableOn(TestConfigurationActions.update, (state) => {
    state.isSubmitting = true;
    state.submitStatus = "idle";
  }),
  mutableOn(TestConfigurationActions.updateSuccess, (state, {type, ...updatedData}) => {
    state.isSubmitting = false;
    state.submitStatus = "success";

    let testType = state.table.items.find(e => e.id === updatedData.id);

    if (testType) {
      testType.categorySkill = updatedData.categorySkill;
      testType.code = updatedData.code,
      testType.duration = updatedData.duration,
      testType.id = updatedData.id,
      testType.name = updatedData.name,
      testType.parts = updatedData.parts,
      testType.questions = updatedData.questions
    }
  }),
  mutableOn(TestConfigurationActions.updateFailure, (state) => {
    state.isSubmitting = false;
    state.submitStatus = "error";
  }),

  mutableOn(TestConfigurationActions.resetSubmitStatus, (state) => {
    state.submitStatus = "idle";
  }),

  mutableOn(TestConfigurationActions.remove, (state) => {
    state.isSubmitting = true;
    state.submitStatus = "idle"
  }),
  mutableOn(TestConfigurationActions.removeSuccess, (state, { id }) => {
    state.isSubmitting = false;
    state.submitStatus = "success";
    state.table.items = state.table.items.filter(t => t.id !== id);
  }),
  mutableOn(TestConfigurationActions.removeFailure, (state) => {
    state.isSubmitting = false;
    state.submitStatus = "error"
  }),
)

export default testConfigurationReducer;