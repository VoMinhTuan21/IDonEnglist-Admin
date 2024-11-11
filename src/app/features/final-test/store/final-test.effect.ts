import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { FinalTestService } from '../final-test.service';
import FinalTestActions from './final-test.action';
import { catchError, map, mergeMap, of, take, withLatestFrom } from 'rxjs';
import { NzMessageService } from 'ng-zorro-antd/message';
import { select, Store } from '@ngrx/store';
import { FinalTestSelect } from './final-test.selector';

@Injectable()
export class FinalTestEffects {
  constructor(
    private actions$: Actions,
    private finalTestService: FinalTestService,
    private messageService: NzMessageService,
    private store: Store
  ) {}

  getPagination$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FinalTestActions.getPagination),
      mergeMap(({ filter }) =>
        this.finalTestService.getPagination(filter).pipe(
          map((paginatedFinalTests) =>
            FinalTestActions.getPaginationSuccess({
              response: paginatedFinalTests,
            })
          ),
          catchError(() => of(FinalTestActions.getPaginationFailure()))
        )
      )
    )
  );

  create$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FinalTestActions.create),
      mergeMap(({ data }) =>
        this.finalTestService.create(data).pipe(
          map((createdId) => {
            this.messageService.success('Create Success');
            return FinalTestActions.createSuccess({ response: createdId });
          }),
          catchError(() => of(FinalTestActions.createFailure()))
        )
      )
    )
  );

  createSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FinalTestActions.createSuccess),
      withLatestFrom(this.store.pipe(select(FinalTestSelect.table))),
      take(1),
      mergeMap(([action, table]) => {
        return of(
          FinalTestActions.getPagination({
            filter: { pageNumber: table.pageNumber, pageSize: table.pageSize },
          })
        );
      })
    )
  );
}