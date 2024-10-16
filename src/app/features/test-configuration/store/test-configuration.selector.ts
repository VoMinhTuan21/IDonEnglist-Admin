import { createFeatureSelector, createSelector } from "@ngrx/store";
import { TestConfigurationState } from "./test-configuration.state";

export const selectTestConfiguration = createFeatureSelector<TestConfigurationState>("testConfiguration");

export const TestConfigurationSelect = {
  loading: createSelector(selectTestConfiguration, (state: TestConfigurationState) => state.loading),
  table: createSelector(selectTestConfiguration, (state: TestConfigurationState) => state.table),
  isSubmitting: createSelector(selectTestConfiguration, (state: TestConfigurationState) => state.isSubmitting),
  submitStatus: createSelector(selectTestConfiguration, (state: TestConfigurationState) => state.submitStatus),
}