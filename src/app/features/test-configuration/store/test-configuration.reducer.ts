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
  })
)

export default testConfigurationReducer;