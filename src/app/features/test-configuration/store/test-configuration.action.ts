import { createAction, props } from "@ngrx/store";
import { CreateTestTypeRequest, ITestTypeTableItem } from "../models/test-configuration";
import { PaginatedList, PaginationRequest } from "@shared/models/common";

const create = createAction("[Test Configuration] Create", props<CreateTestTypeRequest>());
const createSuccess = createAction("[Test Configuration] Create Success", props<ITestTypeTableItem>());
const createFailure = createAction("[Test Configuration] Create Failure");

const getPagination = createAction("[Test Configuration] Get Pagination", props<PaginationRequest>());
const getPaginationSuccess = createAction("[Test Configuration] Get Pagination Success", props<PaginatedList<ITestTypeTableItem>>());
const getPaginationFailure = createAction("[Test Configuration] Get Pagination Failure");

export const TestConfigurationActions = {
  create,
  createSuccess,
  createFailure,

  getPagination,
  getPaginationSuccess,
  getPaginationFailure
}