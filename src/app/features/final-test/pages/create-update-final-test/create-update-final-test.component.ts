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
import CollectionActions from '@features/collection/store/collection.action';
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
  Subject,
  switchMap,
  takeUntil
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
    NzIconModule
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
    private store: Store,
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
            pageSize: 10,
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
        if (value === "success" && this.drawerVisible) {
          this.form.reset();
          this.close();
          this.drawerTitle = "Create";
          this.store.dispatch(CollectionActions.resetSubmitStatus());
        }
      })
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
    this.drawerVisible = false;
    this.drawerVisibleChange.emit(this.drawerVisible);
  }

  handleSearch(value: string) {
    this.loadingCollections = true;
    this.collectionSearchChange$.next(value);
  }

  submitForm(): void {
    if (this.form.valid) {
      const { name, collectionId } = this.form.value;

      this.store.dispatch(
        FinalTestActions.create({
          data: {
            collectionId: collectionId ?? 0,
            name: name ?? ""
          }
        })
      );
    } else {
      Object.values(this.form.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      })
    }
  }
}
