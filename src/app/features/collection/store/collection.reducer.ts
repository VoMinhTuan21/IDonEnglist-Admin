import { createReducer } from "@ngrx/store";
import { initialCollectionState } from "./collection.state";
import { mutableOn } from "ngrx-etc";
import CollectionActions from "./collection.action";

const collectionReducer = createReducer(
  initialCollectionState,

  mutableOn(CollectionActions.getPagination, (state) => {
    state.loadingTable = true;
  }),
  mutableOn(CollectionActions.getPaginationSuccess, (state, { response }) => {
    state.table = response;
    state.loadingTable = false;
  }),
  mutableOn(CollectionActions.getPaginationFailure, (state) => {
    state.loadingTable = false;
  }),

  mutableOn(CollectionActions.create, (state) => {
    state.isSubmitting = true;
    state.submitStatus = "pending";
  }),
  mutableOn(CollectionActions.createSuccess, (state) => {
    state.isSubmitting = false;
    state.submitStatus = "success";
  }),
  mutableOn(CollectionActions.createFailure, (state) => {
    state.isSubmitting = false,
    state.submitStatus = "error";
  }),

  mutableOn(CollectionActions.resetSubmitStatus, (state) => {
    state.submitStatus = "idle"
  }),

  mutableOn(CollectionActions.update, (state) => {
    state.isSubmitting = true;
    state.submitStatus = "pending";
  }),
  mutableOn(CollectionActions.updateSuccess, (state) => {
    state.isSubmitting = false;
    state.submitStatus = "success"
  }),
  mutableOn(CollectionActions.updateFailure, (state) => {
    state.isSubmitting = false;
    state.submitStatus = "error";
  }),

  mutableOn(CollectionActions.remove, (state) => {
    state.isSubmitting = true;
    state.submitStatus = "pending";
  }),
  mutableOn(CollectionActions.removeSuccess, (state) => {
    state.isSubmitting = false;
    state.submitStatus = "success";
  }),
  mutableOn(CollectionActions.removeFailure, (state) => {
    state.isSubmitting = false;
    state.submitStatus = "error";
  }),

  mutableOn(CollectionActions.setSearch, (state, {search}) => {
    state.search = search;
  }),

  mutableOn(CollectionActions.setSelectedCollectionId, (state, { id }) => {
    state.selectedCollectionId = id;
  })
);

export default collectionReducer;