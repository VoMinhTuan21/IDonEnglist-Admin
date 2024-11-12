import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CollectionService } from '@features/collection/collection.service';
import { CollectionMin } from '@features/collection/models/collection.model';
import { UpdateFinalTestRequest } from '@features/final-test/models/final-test.model';
import FinalTestActions from '@features/final-test/store/final-test.action';
import { FinalTestSelect } from '@features/final-test/store/final-test.selector';
import { Store } from '@ngrx/store';
import { DrawerComponent } from '@shared/components/drawer/drawer.component';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import {
  debounceTime,
  filter,
  Subject,
  switchMap,
  takeUntil,
  withLatestFrom
} from 'rxjs';

@Component({
  selector: 'app-create-update-final-test',
  standalone: true,
  imports: [
    NzButtonModule,
    NzFormModule,
    ReactiveFormsModule,
    NzSelectModule,
    DrawerComponent,
    NzInputModule,
    NzIconModule,
  ],
  templateUrl: './create-update-final-test.component.html',
  styleUrl: './create-update-final-test.component.scss',
})
export class CreateUpdateFinalTestComponent implements OnInit, OnDestroy {
  @Input() drawerVisible: boolean = false;
  @Output() drawerVisibleChange = new EventEmitter<boolean>();
  drawerTitle: string = 'Create';
  collections: CollectionMin[] = [];
  loadingCollections: boolean = false;
  collectionSearchChange$ = new Subject<string>();
  isSubmitting: boolean = false;
  finalTestId: number = 0;
  unsubscribe$ = new Subject<void>();

  form: FormGroup<{
    name: FormControl<string>;
    collectionId: FormControl<number>;
  }> = this.fb.group({
    collectionId: [0, [Validators.required]],
    name: ['', [Validators.required]],
  });

  constructor(
    private fb: NonNullableFormBuilder,
    private collectionService: CollectionService,
    private store: Store
  ) {}

  ngOnInit(): void {
    this.collectionSearchChange$
      .pipe(
        takeUntil(this.unsubscribe$),
        debounceTime(1000),
        switchMap((keywords) =>
          this.collectionService.getPagination({
            minSize: true,
            pageNumber: 1,
            pageSize: 5,
            keywords,
          })
        )
      )
      .subscribe((value) => {
        this.loadingCollections = false;
        this.collections = value.items;
      });

    this.store
      .select(FinalTestSelect.isSubmitting)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((value) => (this.isSubmitting = value));

    this.store
      .select(FinalTestSelect.submitStatus)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((value) => {
        if (value === 'success' && this.drawerVisible) {
          this.form.reset();
          this.close();
          this.store.dispatch(FinalTestActions.resetSubmitStatus());
        }
      });

    this.store
      .select(FinalTestSelect.selectedFinalTestId)
      .pipe(
        takeUntil(this.unsubscribe$),
        filter((id) => id !== 0),
        withLatestFrom(this.store.select(FinalTestSelect.table))
      )
      .subscribe(([id, table]) => {
        this.finalTestId = id;
        this.open();
        this.drawerTitle = "Update";
        
        const finalTest = table?.items?.find(ft => ft.id === id);

        if (finalTest) {
          this.form.patchValue({
            name: finalTest.name,
            collectionId: finalTest.collection.id
          });

          this.collections = [finalTest.collection];
        }
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  open() {
    this.drawerVisible = true;
    this.drawerVisibleChange.emit(this.drawerVisible);
  }

  close() {
    this.form.reset();
    this.drawerTitle = "Create";
    this.store.dispatch(FinalTestActions.setSelectedFinalTest({ id: 0 }));
    this.drawerVisible = false;
    this.drawerVisibleChange.emit(this.drawerVisible);
    this.finalTestId = 0;
  }

  handleSearch(value: string) {
    this.loadingCollections = true;
    this.collectionSearchChange$.next(value);
  }

  submitForm(): void {
    if (this.form.valid) {
      const { name, collectionId } = this.form.value;
      const isUpdate = this.finalTestId !== 0;

      const data = {
        collectionId: collectionId ?? 0,
        name: name ?? '',
        ...(isUpdate ? { id: this.finalTestId } : {}),
      };

      if (this.finalTestId) {
        this.store.dispatch(
          FinalTestActions.update({ data: data as UpdateFinalTestRequest })
        );
      } else {
        this.store.dispatch(FinalTestActions.create({ data }));
      }
    } else {
      Object.values(this.form.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }
}
