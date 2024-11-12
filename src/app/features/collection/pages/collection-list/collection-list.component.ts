import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
} from '@angular/forms';
import { Category } from '@features/category/models/category.model';
import CategoryActions from '@features/category/store/category.action';
import { CategorySelect } from '@features/category/store/category.selector';
import {
  CollectionTableItem,
  GetPaginationCollectionRequest,
} from '@features/collection/models/collection.model';
import CollectionActions from '@features/collection/store/collection.action';
import { CollectionSelect } from '@features/collection/store/collection.selector';
import { Store } from '@ngrx/store';
import { PaginatedList } from '@shared/models/common';
import { Utils } from '@shared/utils/utils';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTableModule } from 'ng-zorro-antd/table';
import { map, Subject, takeUntil } from 'rxjs';
import { BoxComponent } from '../../../../shared/components/box/box.component';
import { CreateUpdateCollectionComponent } from '../create-update-collection/create-update-collection.component';
import { ActivatedRoute, ParamMap, Router, RouterLink } from '@angular/router';
import { UrlCodePipe } from '@core/pipes/url.pipe';

@Component({
  selector: 'app-collection-list',
  standalone: true,
  imports: [
    BoxComponent,
    NzTableModule,
    NzIconModule,
    NzPopconfirmModule,
    NzFlexModule,
    NzButtonModule,
    CreateUpdateCollectionComponent,
    NzFormModule,
    ReactiveFormsModule,
    NzInputModule,
    NzSelectModule,
    NzButtonModule,
    RouterLink,
    UrlCodePipe,
  ],
  templateUrl: './collection-list.component.html',
  styleUrl: './collection-list.component.scss',
})
export class CollectionListComponent implements OnInit, OnDestroy {
  table!: PaginatedList<CollectionTableItem>;
  loadingTable: boolean = false;
  categories: Category[] = [];
  utils = Utils;
  drawerVisible = false;
  private unsubscribe$ = new Subject<void>();

  searchForm: FormGroup<{
    keywords: FormControl<string>;
    categoryId: FormControl<number>;
  }> = this.fb.group({
    keywords: [''],
    categoryId: [0],
  });

  constructor(
    private readonly store: Store,
    private fb: NonNullableFormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.store
      .select(CollectionSelect.table)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((value) => (this.table = value));

    this.store
      .select(CategorySelect.categories)
      .pipe(
        takeUntil(this.unsubscribe$),
        map((value) => value.map((c) => c.children as Category[]).flat())
      )
      .subscribe((value) => {
        this.categories = value;
        if (value?.length === 0) {
          this.store.dispatch(CategoryActions.getAll());
        }
      });

    this.store
      .select(CollectionSelect.loadingTable)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((value) => (this.loadingTable = value));

    this.route.queryParamMap
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((queryParams) => {
        this.setInitFormValue(queryParams);

        const filter: GetPaginationCollectionRequest = {
          keywords: queryParams.get('keywords') ?? '',
          categoryId: Number(queryParams.get('categoryId')) ?? 0,
          pageNumber: this.table?.pageNumber ?? 1,
          pageSize: this.table?.pageSize ?? 5,
        };

        this.getTableData({ ...Utils.cleanObject(filter) });
      });

    this.route.paramMap
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((params) => {
        if (Number(params.get('id')?.split('-').pop())) {
          this.drawerVisible = true;
        }
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  getTableData(filter: GetPaginationCollectionRequest) {
    this.store.dispatch(CollectionActions.getPagination({ filter }));
  }

  handlePageIndexChange(pageIndex: number) {
    const { keywords, categoryId } = this.searchForm.value;
    this.getTableData({
      ...Utils.cleanObject({
        pageNumber: pageIndex,
        pageSize: 5,
        keywords,
        categoryId,
      }),
    });
  }

  handleSearch() {
    const { keywords, categoryId } = this.searchForm.value;
    this.router.navigate(['/collection'], {
      queryParams: { ...Utils.cleanObject({ keywords, categoryId }) },
    });
  }

  setInitFormValue(queryParams: ParamMap) {
    this.searchForm.patchValue({
      keywords: queryParams.get('keywords') ?? '',
      categoryId: Number(queryParams.get('categoryId')) ?? 0,
    });
  }

  clearSearch() {
    this.searchForm.reset();
    this.router.navigate(['/collection']);
  }

  handleDelete(id: number) {
    this.store.dispatch(CollectionActions.remove({ id }));
  }
}
