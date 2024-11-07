import { createAction, props } from '@ngrx/store';
import { CollectionTableItem, CreateCollectionRequest, GetPaginationCollectionRequest, UpdateCollectionRequest } from '../models/collection.model';
import { PaginatedList } from '@shared/models/common';

const getPagination = createAction(
  '[Collection] Get Pagination',
  props<{ filter: GetPaginationCollectionRequest }>()
);
const getPaginationSuccess = createAction(
  "[Collection] Get Pagination Success",
  props<{response: PaginatedList<CollectionTableItem>}>()
);
const getPaginationFailure = createAction(
  "[Collection] Get Pagination Failure"
);

const create = createAction(
  '[Collection] Create', props<{data: CreateCollectionRequest}>()
);
const createSuccess = createAction(
  '[Collection] Create Success', props<{response: CollectionTableItem}>()
);
const createFailure = createAction(
  '[Collection] Create Failure'
)

const resetSubmitStatus = createAction(
  '[Collection] Reset Submit Status'
)

const update = createAction(
  '[Collection] Update', props<{data: UpdateCollectionRequest}>()
);
const updateSuccess = createAction(
  '[Collection] Update Success'
);
const updateFailure = createAction(
  '[Collection] Update Failure'
);

const remove = createAction(
  '[Collection] Remove', props<{id: number}>()
);
const removeSuccess = createAction(
  '[Collection] Remove Success'
);
const removeFailure = createAction(
  '[Collection] Remove Failure'
)

const CollectionActions = {
  getPagination,
  getPaginationSuccess,
  getPaginationFailure,

  create,
  createSuccess,
  createFailure,

  resetSubmitStatus,

  update,
  updateSuccess,
  updateFailure,

  remove,
  removeSuccess,
  removeFailure
}

export default CollectionActions;