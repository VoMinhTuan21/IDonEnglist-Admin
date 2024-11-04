import { createAction, props } from '@ngrx/store';
import {
  CreateTestTypeRequest,
  ITestTypeTableItem,
  TestTypeDetail,
  UpdateTestTypeRequest,
} from '../models/test-configuration';
import { PaginatedList, PaginationRequest, SubmitStatus } from '@shared/models/common';

const create = createAction(
  '[Test Configuration] Create',
  props<CreateTestTypeRequest>()
);
const createSuccess = createAction(
  '[Test Configuration] Create Success',
  props<ITestTypeTableItem>()
);
const createFailure = createAction('[Test Configuration] Create Failure');

const getPagination = createAction(
  '[Test Configuration] Get Pagination',
  props<PaginationRequest>()
);
const getPaginationSuccess = createAction(
  '[Test Configuration] Get Pagination Success',
  props<PaginatedList<ITestTypeTableItem>>()
);
const getPaginationFailure = createAction(
  '[Test Configuration] Get Pagination Failure'
);

const update = createAction(
  '[Test Configuration] Update',
  props<UpdateTestTypeRequest>()
)
const updateSuccess = createAction(
  '[Test Configuration] Update Success',
  props<ITestTypeTableItem>()
)
const updateFailure = createAction(
  '[Test Configuration] Update Failure',
)

const resetSubmitStatus = createAction(
  '[Test Configuration] Reset Submit Status'
)

const remove = createAction(
  '[Test Configuration] Remove',
  props<{id: number}>()
);
const removeSuccess = createAction(
  '[Test Configuration] Remove Success',
  props<{id: number}>()
)
const removeFailure = createAction(
  '[Test Configuration] Remove Failure'
)

export const TestConfigurationActions = {
  create,
  createSuccess,
  createFailure,

  getPagination,
  getPaginationSuccess,
  getPaginationFailure,

  update,
  updateSuccess,
  updateFailure,

  resetSubmitStatus,

  remove,
  removeSuccess,
  removeFailure
};
