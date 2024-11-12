import { createAction, props } from "@ngrx/store";
import { PaginatedList } from "@shared/models/common";
import { CreateFinalTestRequest, FinalTestSearch, FinalTestTableItem, GetPaginationFinalTestsRequest, UpdateFinalTestRequest } from "../models/final-test.model";

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
);

const resetSubmitStatus = createAction(
  '[Final Test] Reset Submit Status'
);

const update = createAction(
  '[Final Test] Update',
  props<{data: UpdateFinalTestRequest}>()
);
const updateSuccess = createAction(
  '[Final Test] Update Success',
  props<{response: number}>()
);
const updateFailure = createAction(
  '[Final Test] Update'
);

const setSearch = createAction(
  '[Final Test]  Set Search',
  props<{search: FinalTestSearch}>()
);

const setSelectedFinalTest = createAction(
  '[Final Test] Set Selected Final Test',
  props<{ id: number }>()
);

const remove = createAction(
  '[Final Test] Remove',
  props<{id: number}>()
);
const removeSuccess = createAction(
  '[Final Test] Remove Success',
  props<{response: number}>()
);
const removeFailure = createAction(
  '[Final Test] Remove Failure'
)

const FinalTestActions = {
  getPagination,
  getPaginationSuccess,
  getPaginationFailure,

  create,
  createSuccess,
  createFailure,

  resetSubmitStatus,

  update,
  updateFailure,
  updateSuccess,

  setSearch,

  setSelectedFinalTest,

  remove,
  removeSuccess,
  removeFailure
}

export default FinalTestActions;