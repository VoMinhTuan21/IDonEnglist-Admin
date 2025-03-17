import { Injectable } from '@angular/core';
import { CategoryService } from '../category.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import CategoryActions from './category.action';
import { catchError, mergeMap, of, map } from 'rxjs';
import { NzMessageService } from 'ng-zorro-antd/message';

@Injectable()
export class CategoryEffects {
  constructor(
    private actions$: Actions,
    private categoryService: CategoryService,
    private messageService: NzMessageService
  ) {}

  getAll$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CategoryActions.getAll),
      mergeMap(() =>
        this.categoryService.getAll().pipe(
          map((categories) => {
            return CategoryActions.getAllSuccess({ categories: categories });
          }),
          catchError((error) => of(CategoryActions.getAllFailure()))
        )
      )
    )
  );

  create$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CategoryActions.create),
      mergeMap(({ type, ...data }) =>
        this.categoryService.create(data).pipe(
          map((value) => {
            if (value.id) {
              this.messageService.success('Create success.');
            }
            return CategoryActions.createSuccess(value);
          }),
          catchError(() => of(CategoryActions.createFailure()))
        )
      )
    )
  );

  update$ = createEffect(() => 
    this.actions$.pipe(
      ofType(CategoryActions.update),
      mergeMap(({type, ...data}) => 
        this.categoryService.update(data).pipe(
          map((value) => {
            if (value.id) {
              this.messageService.success("Update success.");
            }
            return CategoryActions.updateSuccess(value);
          }),
          catchError(() => of(CategoryActions.updateFailure()))
        )
      )
    )
  )

  delete$ = createEffect(() => 
  this.actions$.pipe(
    ofType(CategoryActions.remove),
    mergeMap(({type, ...data}) => 
      this.categoryService.delete(data).pipe(
        map((value) => {
          if (value.id) {
            this.messageService.success("Delete success.");
          }
          return CategoryActions.removeSuccess(value);
        }),
        catchError(() => of(CategoryActions.removeFailure()))
      )
    )
  ))
}
