import { createAction, props } from "@ngrx/store";
import { CreateTestRequest, TestMinViewModel } from "../models/test.model";
import { GetListTestPartsRequest, TestPart } from "@features/test-part/models/test-part.model";

const create = createAction(
  "[Test] Create", props<{data: CreateTestRequest}>()
);
const createSuccess = createAction(
  "[Test] Create Success",
  props<{test: TestMinViewModel}>()
);
const createFailure = createAction(
  "[Test] Create Failure"
);

const getListTestParts = createAction(
  "[Test] Get List Test Parts",
  props<{filter: GetListTestPartsRequest}>()
);
const getListTestPartsSuccess = createAction(
  "[Test] Get List Test Parts Success",
  props<{parts: TestPart[]}>()
);
const getListTestPartsFailure = createAction(
  "[Test] Get List Test Parts Failure"
);

const setSelectedTestPartId = createAction(
  "[Test] Set Selected Test Part Id",
  props<{id: number}>()
)

const TestActions = {
  create,
  createSuccess,
  createFailure,

  getListTestParts,
  getListTestPartsFailure,
  getListTestPartsSuccess,

  setSelectedTestPartId
};

export default TestActions;