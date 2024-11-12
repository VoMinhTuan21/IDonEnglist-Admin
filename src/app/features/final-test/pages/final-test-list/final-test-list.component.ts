import { Component, OnDestroy, OnInit } from '@angular/core';
import { BoxComponent } from '../../../../shared/components/box/box.component';
import { Store } from '@ngrx/store';
import { BehaviorSubject, debounceTime, skip, Subject, switchMap, take, takeUntil } from 'rxjs';
import { PaginatedList } from '@shared/models/common';
import {
  FinalTestTableItem,
  GetPaginationFinalTestsRequest,
} from '@features/final-test/models/final-test.model';
import {
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute, ParamMap, Router, RouterLink } from '@angular/router';
import FinalTestActions from '@features/final-test/store/final-test.action';
import { FinalTestSelect } from '@features/final-test/store/final-test.selector';
import { Utils } from '@shared/utils/utils';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTableModule } from 'ng-zorro-antd/table';
import { UrlCodePipe } from '@core/pipes/url.pipe';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { CreateUpdateFinalTestComponent } from "../create-update-final-test/create-update-final-test.component";
import { CollectionMin } from '@features/collection/models/collection.model';
import { CollectionService } from '@features/collection/collection.service';

@Component({
  selector: 'app-final-test-list',
  standalone: true,
  imports: [
    BoxComponent,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzSelectModule,
    NzButtonModule,
    NzIconModule,
    NzTableModule,
    RouterLink,
    UrlCodePipe,
    NzFlexModule,
    NzPopconfirmModule,
    CreateUpdateFinalTestComponent
],
  templateUrl: './final-test-list.component.html',
  styleUrl: './final-test-list.component.scss',
})
export class FinalTestListComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject<void>();
  table!: PaginatedList<FinalTestTableItem>;
  loadingTable: boolean = false;
  collections: CollectionMin[] = [];
  collectionSearchChange$ = new BehaviorSubject("");
  loadingCollections: boolean = false;

  searchForm: FormGroup<{
    keywords: FormControl<string>;
    collectionId: FormControl<number>;
  }> = this.fb.group({
    keywords: [''],
    collectionId: [0],
  });

  constructor(
    private readonly store: Store,
    private fb: NonNullableFormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private collectionService: CollectionService
  ) {}

  ngOnInit(): void {
    this.store
      .select(FinalTestSelect.table)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((value) => (this.table = value));

    this.store
      .select(FinalTestSelect.loadingTable)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((value) => (this.loadingTable = value));

    this.route.queryParamMap
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((queryParams) => {
        this.setInitFormValue(queryParams);

        const filter: GetPaginationFinalTestsRequest = {
          keywords: queryParams.get('keywords') ?? '',
          collectionId: Number(queryParams.get('collectionId')),
          pageNumber: this.table?.pageNumber ?? 1,
          pageSize: this.table?.pageSize ?? 5,
        };

        this.getTableData({ ...Utils.cleanObject(filter) });
      });

    this.collectionSearchChange$
      .pipe(
        takeUntil(this.unsubscribe$),
        skip(1),
        debounceTime(1000),
        switchMap((keywords) =>
          this.collectionService.getPagination({
            minSize: true,
            keywords,
            pageSize: 10,
            pageNumber: 1,
          })
        )
      )
      .subscribe((value) => {this.collections = value.items; this.loadingCollections = false});
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  getTableData(filter: GetPaginationFinalTestsRequest) {
    this.store.dispatch(FinalTestActions.getPagination({ filter }));
  }

  setInitFormValue(queryParams: ParamMap) {
    this.searchForm.patchValue({
      keywords: queryParams.get('keywords') ?? '',
      collectionId: Number(queryParams.get('collectionId')) ?? 0,
    });
  }

  handleSearchCollection(keywords: string) {
    this.loadingCollections = true;
    this.collectionSearchChange$.next(keywords);
  }

  handleSearch() {
    const { keywords, collectionId } = this.searchForm.value;
    this.store.dispatch(FinalTestActions.setSearch({search: {...Utils.cleanObject({keywords, collectionId})}}))
    this.router.navigate(['/final-test'], {
      queryParams: { ...Utils.cleanObject({ keywords, collectionId })}
    })
  }

  clearSearch() {
    this.searchForm.reset();
    this.router.navigate(['/final-test']);
  }

  handleOpenUpdateDrawer(id: number) {
    this.store.dispatch(FinalTestActions.setSelectedFinalTest({id}))
  }

  handlePageIndexChange(pageNumber: number) {
    const { keywords, collectionId } = this.searchForm.value;
    this.getTableData({...Utils.cleanObject({
      pageSize: 5,
      pageNumber,
      keywords,
      collectionId
    })})
  }

  handleDelete(id: number) {
    this.store.dispatch(FinalTestActions.remove({ id }));
  }
}
