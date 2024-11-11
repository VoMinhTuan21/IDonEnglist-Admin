import { createAction, props } from "@ngrx/store";
import { PaginatedList } from "@shared/models/common";
import { CreateFinalTestRequest, FinalTestTableItem, GetPaginationFinalTestsRequest } from "../models/final-test.model";

const getPagination = createAction(
  '[Final Test] Get Pagination',
  props<{filter: GetPaginationFinalTestsRequest}>()
);
const getPaginationSuccess = createAction(
  '[Final Test] Get Pagination Success',
  props<{response: PaginatedList<FinalTestTableItem>}>()
);
const getPaginationFailure = createAction(
  '[Final Test] Get Pagination Failure'
);

const create = createAction(
  '[Final Test] Create',
  props<{data: CreateFinalTestRequest}>()
);
const createSuccess = createAction(
  '[Final Test] Create Success',
  props<{response: number}>()
);
const createFailure = createAction(
  '[Final Test] Create Failure'
)

const resetSubmitStatus = createAction(
  '[Final Test] Reset Submit Status'
)

const FinalTestActions = {
  getPagination,
  getPaginationSuccess,
  getPaginationFailure,

  create,
  createSuccess,
  createFailure,

  resetSubmitStatus
}

export default FinalTestActions;