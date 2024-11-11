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
import { ActivatedRoute, Router } from '@angular/router';
import { Category } from '@features/category/models/category.model';
import { CategorySelect } from '@features/category/store/category.selector';
import CollectionActions from '@features/collection/store/collection.action';
import { CollectionSelect } from '@features/collection/store/collection.selector';
import { Store } from '@ngrx/store';
import { FileModel } from '@shared/models/common';
import { UploadImageUrl } from '@shared/models/constants';
import { Utils } from '@shared/utils/utils';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzUploadFile, NzUploadModule } from 'ng-zorro-antd/upload';
import { filter, map, Observable, Subject, takeUntil, withLatestFrom } from 'rxjs';

@Component({
  selector: 'app-create-update-collection',
  standalone: true,
  imports: [
    NzButtonModule,
    NzIconModule,
    NzDrawerModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzSelectModule,
    NzUploadModule,
    NzSpinModule
  ],
  templateUrl: './create-update-collection.component.html',
  styleUrl: './create-update-collection.component.scss',
})
export class CreateUpdateCollectionComponent implements OnInit, OnDestroy {
  @Input() drawerVisible = false;
  @Output() drawerVisibleChange = new EventEmitter<boolean>();

  drawerTitle: string = 'Create';
  uploadUrl = UploadImageUrl;
  form: FormGroup<{
    name: FormControl<string>;
    categoryId: FormControl<number>;
    thumbnail: FormControl<FileModel>;
  }> = this.fb.group({
    name: ['', [Validators.required]],
    categoryId: [0, [Validators.required]],
    thumbnail: [{} as FileModel, [Validators.required]],
  });
  categories: Category[] = [];
  uploading: boolean = false;
  isSubmitting: boolean = false;
  collectionId: number = 0;
  private unsubscribe$ = new Subject<void>();

  constructor(
    private fb: NonNullableFormBuilder,
    private store: Store,
    private messageService: NzMessageService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  open() {
    this.drawerVisible = true;
    this.drawerVisibleChange.emit(this.drawerVisible);
  }

  close() {
    this.drawerVisible = false;
    this.drawerVisibleChange.emit(this.drawerVisible);
  }

  ngOnInit(): void {
    this.store
      .select(CategorySelect.categories)
      .pipe(
        takeUntil(this.unsubscribe$),
        map((value) => value.map((c) => c.children as Category[]).flat())
      )
      .subscribe((value) => (this.categories = value));

    this.store
      .select(CollectionSelect.isSubmitting)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((value) => {
        this.isSubmitting = value;
      });

    this.store
      .select(CollectionSelect.submitStatus)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((value) => {
        if (value === 'success' && this.drawerVisible) {
          this.form.reset();
          this.close();
          this.drawerTitle = "Create";
          this.store.dispatch(CollectionActions.resetSubmitStatus());
          if (this.collectionId) {
            this.router.navigate(["/collection"])
          }
        }
      });
    
    this.store
      .select(CollectionSelect.table)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(value => {
        const collection = value.items?.find(cl => cl.id === this.collectionId);

        if (collection) {
          this.drawerTitle = "Update";
          this.form.patchValue({
            categoryId: collection.categoryId,
            name: collection.name,
            thumbnail: {
              publicId: "",
              url: collection.thumbnail
            }
          })
        }
      })

    this.route.paramMap
      .pipe(takeUntil(this.unsubscribe$), filter(params => !!Number(params.get("id")?.split("-").pop())), withLatestFrom(this.store.select(CollectionSelect.table)))
      .subscribe(([params, table])=> {
        this.collectionId = Number(params.get("id")?.split("-").pop());
        const collection = table.items?.find(cl => cl.id === this.collectionId);

        if (collection) {
          this.drawerTitle = "Update";
          this.form.patchValue({
            categoryId: collection.categoryId,
            name: collection.name,
            thumbnail: {
              publicId: "",
              url: collection.thumbnail
            }
          })
        }
      })
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  get thumbnail() {
    return this.form.get('thumbnail')?.value;
  }

  beforeUpload(
    file: NzUploadFile,
    _fileList: NzUploadFile[]
  ): Observable<boolean> {
    return Utils.beforeImageUpload(this.messageService, file, _fileList);
  }

  handleChange(info: { file: NzUploadFile }): void {
    switch (info.file.status) {
      case 'uploading':
        this.uploading = true;
        break;
      case 'done':
        this.uploading = false;
        this.form.patchValue({
          thumbnail: {
            publicId: info.file.response.publicId,
            url: info.file.response.secureUrl,
          },
        });
        break;
      case 'error':
        this.messageService.error('Network error');
        this.uploading = false;
        break;
    }
  }

  submitForm(): void {
    if (this.form.valid) {
      const { name, categoryId, thumbnail } = this.form.value;
      if (this.collectionId) {
        this.store.dispatch(
          CollectionActions.update({
            data: {
              id: this.collectionId,
              categoryId,
              name,
              ...(thumbnail?.publicId ? {thumbnail} : {})
            }
          })
        );
      } else {
        this.store.dispatch(
          CollectionActions.create({
            data: {
              categoryId: categoryId ?? 0,
              name: name ?? '',
              thumbnail: thumbnail ?? { publicId: '', url: '' },
            },
          })
        );
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
