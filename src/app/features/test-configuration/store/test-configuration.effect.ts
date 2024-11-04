import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { TestConfigurationService } from '../test-configuration.service';
import { TestConfigurationActions } from './test-configuration.action';
import { catchError, map, mergeMap, of } from 'rxjs';
import { NzMessageService } from 'ng-zorro-antd/message';

@Injectable()
export class TestConfigurationEffects {
  constructor(
    private actions$: Actions,
    private testConfigurationService: TestConfigurationService,
    private messageService: NzMessageService
  ) {}

  create$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TestConfigurationActions.create),
      mergeMap(({ type, ...data }) =>
        this.testConfigurationService.create(data).pipe(
          map((value) => {
            if (value.id) {
              this.messageService.success('Create success');
            }

            return TestConfigurationActions.createSuccess(value);
          }),
          catchError(() => of(TestConfigurationActions.createFailure()))
        )
      )
    )
  );

  getPagination$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TestConfigurationActions.getPagination),
      mergeMap(({ type, ...data }) =>
        this.testConfigurationService.getPagination(data).pipe(
          map((value) => TestConfigurationActions.getPaginationSuccess(value)),
          catchError(() => of(TestConfigurationActions.getPaginationFailure()))
        )
      )
    )
  );

  update$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TestConfigurationActions.update),
      mergeMap(({ type, ...data }) =>
        this.testConfigurationService.update(data).pipe(
          map((value) => {
            if (value.id) {
              this.messageService.success('Create success');
            }
            return TestConfigurationActions.updateSuccess(value);
          }),
          catchError(() => of(TestConfigurationActions.updateFailure()))
        )
      )
    )
  );
}
