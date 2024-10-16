import { AsyncPipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SkillPipe } from '@core/pipes/skill.pipe';
import { Category } from '@features/category/models/category.model';
import CategoryActions from '@features/category/store/category.action';
import { CategorySelect } from '@features/category/store/category.selector';
import { Store } from '@ngrx/store';
import { BoxComponent } from '@shared/components/box/box.component';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { map, Observable, Subject, takeUntil } from 'rxjs';
import { CreateAndUpdateComponent } from '../create-and-update/create-and-update.component';
import { UrlCodePipe } from '@core/pipes/url.pipe';

interface CategoryTable extends Category {
  expand?: boolean;
}

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [
    NzTableModule,
    NzTagModule,
    AsyncPipe,
    NzIconModule,
    NzFlexModule,
    BoxComponent,
    CreateAndUpdateComponent,
    RouterLink,
    NzPopconfirmModule,
    SkillPipe,
    UrlCodePipe
  ],
  templateUrl: './category.component.html',
  styleUrl: './category.component.scss',
})
export class CategoryComponent implements OnInit, OnDestroy {
  loading$!: Observable<boolean>;
  categories$!: Observable<CategoryTable[]>;
  private unsubscribe$ = new Subject<void>();
  drawerVisible = false;

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.loading$ = this.store
      .select(CategorySelect.loading)
      .pipe(takeUntil(this.unsubscribe$));
    this.categories$ = this.store.select(CategorySelect.categories).pipe(
      takeUntil(this.unsubscribe$),
      map((categories) =>
        categories.map((category) => ({ ...category, expand: false }))
      )
    );

    this.store
      .select(CategorySelect.categories)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((categories) => {
        if (categories.length === 0) {
          this.store.dispatch(CategoryActions.getAll());
        }
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  handleOpenDrawer() {
    if(!this.drawerVisible) {
      this.drawerVisible = true;
    }
  }

  confirmDelete(id: number) {
    this.store.dispatch(CategoryActions.remove({ id }))
  }
}
