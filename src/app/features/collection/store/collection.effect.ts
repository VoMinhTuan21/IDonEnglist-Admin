import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { CollectionService } from '../collection.service';
import CollectionActions from './collection.action';
import { catchError, map, mergeMap, of, take, withLatestFrom } from 'rxjs';
import { NzMessageService } from 'ng-zorro-antd/message';
import { select, Store } from '@ngrx/store';
import { CollectionSelect } from './collection.selector';
import { PaginatedList } from '@shared/models/common';
import { CollectionTableItem } from '../models/collection.model';
import { Utils } from '@shared/utils/utils';

@Injectable()
export class CollectionEffects {
  constructor(
    private actions$: Actions,
    private collectionService: CollectionService,
    private messageService: NzMessageService,
    private store: Store
  ) {}

  getPagination$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CollectionActions.getPagination),
      mergeMap(({ filter }) =>
        this.collectionService.getPagination(filter).pipe(
          map((paginatedCollections) =>
            CollectionActions.getPaginationSuccess({
              response:
                paginatedCollections as PaginatedList<CollectionTableItem>,
            })
          ),
          catchError((error) => of(CollectionActions.getPaginationFailure()))
        )
      )
    )
  );

  create$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CollectionActions.create),
      mergeMap(({ data }) =>
        this.collectionService.create(data).pipe(
          map((response) => {
            this.messageService.success('Create success.');
            return CollectionActions.createSuccess({ response });
          }),
          catchError((error) => of(CollectionActions.createFailure()))
        )
      )
    )
  );

  createSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CollectionActions.createSuccess),
      withLatestFrom(
        this.store.pipe(select(CollectionSelect.table)),
        this.store.pipe(select(CollectionSelect.search))
      ),
      mergeMap(([action, table, search]) => {
        const getPagination = CollectionActions.getPagination({
          filter: {
            ...Utils.cleanObject({
              pageNumber: table.pageNumber,
              pageSize: table.pageSize,
              ...search,
            }),
          },
        });

        const resetSubmitStatus = CollectionActions.resetSubmitStatus();

        return of(getPagination, resetSubmitStatus);
      })
    )
  );

  update$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CollectionActions.update),
      mergeMap(({ data }) =>
        this.collectionService.update(data).pipe(
          map(() => {
            this.messageService.success('Update success');
            return CollectionActions.updateSuccess();
          }),
          catchError((error) => of(CollectionActions.updateFailure()))
        )
      )
    )
  );

  updateSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CollectionActions.updateSuccess),
      withLatestFrom(
        this.store.pipe(select(CollectionSelect.table)),
        this.store.pipe(select(CollectionSelect.search))
      ),
      mergeMap(([action, table, search]) => {
        const getPagination = CollectionActions.getPagination({
          filter: {
            ...Utils.cleanObject({
              pageSize: table.pageSize,
              pageNumber: table.pageNumber,
              ...search,
            }),
          },
        });

        const resetSubmitStatus = CollectionActions.resetSubmitStatus();

        return of(getPagination, resetSubmitStatus);
      })
    )
  );

  delete$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CollectionActions.remove),
      mergeMap(({ id }) =>
        this.collectionService.delete(id).pipe(
          map(() => {
            this.messageService.success('Delete success');
            return CollectionActions.removeSuccess();
          }),
          catchError((error) => of(CollectionActions.updateFailure()))
        )
      )
    )
  );

  deleteSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CollectionActions.removeSuccess),
      withLatestFrom(
        this.store.pipe(select(CollectionSelect.table)),
        this.store.pipe(select(CollectionSelect.search))
      ),
      mergeMap(([action, table, search]) => {
        const getPaginationAction = CollectionActions.getPagination({
          filter: {
            ...Utils.cleanObject({
              pageNumber: table.pageNumber,
              pageSize: table.pageSize,
              ...search,
            }),
          },
        });
        const resetSubmitStatusAction = CollectionActions.resetSubmitStatus();

        return of(getPaginationAction, resetSubmitStatusAction);
      })
    )
  );
}
