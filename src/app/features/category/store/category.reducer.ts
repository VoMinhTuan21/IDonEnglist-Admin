import { createReducer, on } from '@ngrx/store';
import { initialCategoryState } from './category.state';
import CategoryActions from './category.action';
import { mutableOn } from 'ngrx-etc';
import { Utils } from '../../../shared/utils/utils';

const categoryReducer = createReducer(
  initialCategoryState,

  mutableOn(CategoryActions.getAll, (state) => {
    state.loading = true;
  }),
  mutableOn(CategoryActions.getAllSuccess, (state, { type, categories }) => {
    state.categories = categories;
    state.loading = false;
  }),
  mutableOn(CategoryActions.getAllFailure, (state) => {
    state.loading = false;
  }),

  mutableOn(CategoryActions.create, (state) => {
    state.isSubmitting = true;
    state.submitStatus = 'idle';
  }),
  mutableOn(
    CategoryActions.createSuccess,
    (state, { type, ...newCategory }) => {
      state.submitStatus = 'success';
      if (!newCategory.parentId) {
        state.categories.push(newCategory);
      } else {
        const parent = state.categories.find(
          (c) => c.id === newCategory.parentId
        );
        if (parent) {
          parent.children = [...(parent.children ?? []), newCategory];
        }
      }
    }
  ),
  mutableOn(CategoryActions.createFailure, (state) => {
    state.isSubmitting = false;
    state.submitStatus = 'error';
  }),

  mutableOn(CategoryActions.update, (state) => {
    state.isSubmitting = true;
    state.submitStatus = 'idle';
  }),
  mutableOn(
    CategoryActions.updateSuccess,
    (state, { type, ...updatedCategory }) => {
      state.isSubmitting = false;
      state.submitStatus = 'success';

      state.categories = Utils.updateCategoryInTree(
        state.categories,
        updatedCategory
      );
    }
  ),
  mutableOn(CategoryActions.updateFailure, (state) => {
    state.isSubmitting = false;
    state.submitStatus = 'error';
  }),

  mutableOn(CategoryActions.remove, (state) => {
    state.isSubmitting = true;
    state.submitStatus = 'idle';
  }),
  mutableOn(CategoryActions.removeSuccess, (state, { type, ...deleted }) => {
    state.isSubmitting = false;
    state.submitStatus = 'success';
    state.categories = Utils.deleteCategoryInTree(state.categories, deleted.id);
  }),
  mutableOn(CategoryActions.removeFailure, (state) => {
    state.isSubmitting = false;
    state.submitStatus = 'error';
  })
);

export default categoryReducer;
