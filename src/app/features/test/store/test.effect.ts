import { Injectable } from "@angular/core";
import { TestPartService } from "@features/test-part/test-part.service";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, map, mergeMap, of } from "rxjs";
import { TestService } from "../test.service";
import TestActions from "./test.action";

@Injectable()
export class TestEffects {
  constructor(
    private actions$: Actions,
    private testService: TestService,
    private testPartService: TestPartService
  ) {}

  create$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TestActions.create),
      mergeMap(({data}) =>
        this.testService.create(data).pipe(
          map((createdTest) => TestActions.createSuccess({ test: createdTest})),
          catchError(() => of(TestActions.createFailure()))
        )
      )
    )
  );

  getListTestParts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TestActions.getListTestParts),
      mergeMap(({filter}) =>
        this.testPartService.getList(filter).pipe(
          map((value) => TestActions.getListTestPartsSuccess({ parts: value })),
          catchError(() => of(TestActions.createFailure()))
        )
      )
    )
  )
}