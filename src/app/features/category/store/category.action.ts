import { createAction, props } from "@ngrx/store";
import { Category, CreateCategoryRequest, DeleteCategoryRequest, UpdateCategoryRequest } from "../models/category.model";

const getAll = createAction("[Category] Get All");
const getAllSuccess = createAction("[Category] Get All Success", props<{categories: Category[]}>());
const getAllFailure = createAction("[Category] Get All Failure");

const create = createAction("[Category] Create", props<CreateCategoryRequest>());
const createSuccess = createAction("[Category] Create Success", props<Category>());
const createFailure = createAction("[Category] Create Failure");

const update = createAction("[Category] Update", props<UpdateCategoryRequest>());
const updateSuccess = createAction("[Category] Update Success", props<Category>());
const updateFailure = createAction("[Category] Update Failure");

const remove = createAction("[Category] Delete", props<DeleteCategoryRequest>());
const removeSuccess = createAction("[Category] Delete Success", props<Category>());
const removeFailure = createAction("[Category] Delete Failure");

const CategoryActions = {
  getAll,
  getAllSuccess,
  getAllFailure,

  create,
  createSuccess,
  createFailure,

  update,
  updateSuccess,
  updateFailure,

  remove,
  removeSuccess,
  removeFailure
}

export default CategoryActions;