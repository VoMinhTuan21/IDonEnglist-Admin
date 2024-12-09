import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { SkillPipe } from '@core/pipes/skill.pipe';
import { CategorySkillService } from '@features/category-skill/category-skill.service';
import { CategorySkillMin } from '@features/category-skill/models/category-skill.model';
import { CollectionService } from '@features/collection/collection.service';
import { CollectionMin } from '@features/collection/models/collection.model';
import { FinalTestService } from '@features/final-test/final-test.service';
import { FinalTestMin } from '@features/final-test/models/final-test.model';
import { TestService } from '@features/test/test.service';
import { UploadAudioUrl } from '@shared/models/constants';
import { Skill } from '@shared/models/enum';
import { Utils } from '@shared/utils/utils';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzUploadFile, NzUploadModule } from 'ng-zorro-antd/upload';
import {
  debounceTime,
  filter,
  Observable,
  Subject,
  switchMap,
  takeUntil,
} from 'rxjs';
import { BoxComponent } from "../../../../../shared/components/box/box.component";

@Component({
  selector: 'app-create-test-form',
  standalone: true,
  imports: [
    NzFormModule,
    ReactiveFormsModule,
    NzButtonModule,
    NzSelectModule,
    NzInputModule,
    NzUploadModule,
    NzIconModule,
    SkillPipe,
    BoxComponent
],
  templateUrl: './create-test-form.component.html',
  styleUrl: './create-test-form.component.scss',
})
export class CreateTestFormComponent {
  private unsubscribe$ = new Subject<void>();

  collections: CollectionMin[] = [];
  loadingCollections: boolean = false;
  collectionSearchChange$ = new Subject<string>();

  finalTests: FinalTestMin[] = [];

  categorySkills: CategorySkillMin[] = [];

  showAudioUpload: boolean = false;
  uploadUrl: string = UploadAudioUrl;
  uploadError: string = '';
  fileList: NzUploadFile[] = [];

  form: FormGroup<{
    name: FormControl<string | null>;
    collectionId: FormControl<number | null>;
    finalTestId: FormControl<number | null>;
    categorySkillId: FormControl<number | null>;
    audio?: FormControl<any | null>;
  }> = this.fb.group({
    name: new FormControl<string | null>({ value: null, disabled: true }),
    collectionId: new FormControl<number | null>(null, [Validators.required]),
    finalTestId: new FormControl<number | null>(
      { value: null, disabled: true },
      [Validators.required]
    ),
    categorySkillId: new FormControl<number | null>(
      { value: null, disabled: true },
      [Validators.required]
    ),
  });

  constructor(
    private fb: NonNullableFormBuilder,
    private collectionService: CollectionService,
    private finalTestService: FinalTestService,
    private categorySkillService: CategorySkillService,
    private messageService: NzMessageService,
    private testService: TestService
  ) {}

  ngOnInit(): void {
    this.collectionSearchChange$
      .pipe(
        takeUntil(this.unsubscribe$),
        debounceTime(1000),
        switchMap((keywords) =>
          this.collectionService.getPagination({
            minSize: true,
            forCreateTest: true,
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

    this.form
      .get('collectionId')
      ?.valueChanges.pipe(filter((x) => x !== 0 && x !== null))
      .subscribe((selectedId) => {
        this.finalTestService
          .getPagination({
            pageNumber: 1,
            pageSize: 20,
            collectionId: selectedId ?? 0,
            forCreateTest: true,
          })
          .subscribe((value) => {
            this.form.get('finalTestId')?.enable();
            this.finalTests = value.items;
          });
      });

    this.form
      .get('finalTestId')
      ?.valueChanges.pipe(filter((x) => x !== 0 && x !== null))
      .subscribe((selectedId) => {
        console.log('selectedId: ', selectedId);
        this.categorySkillService
          .getList({
            finalTestId: selectedId ?? 0,
            collectionId: this.form.get('collectionId')?.value ?? 0,
          })
          .subscribe((value) => {
            this.form.get('categorySkillId')?.enable();
            this.categorySkills = value;
          });
      });

    this.form
      .get('categorySkillId')
      ?.valueChanges.pipe(filter((x) => x !== 0))
      .subscribe((selectedId) => {
        const categorySkill = this.categorySkills.find(
          (ck) => ck.id === selectedId
        );
        this.form.get('name')?.setValue(Skill[categorySkill?.skill ?? 0]);

        if (categorySkill?.skill === Skill.Listening) {
          this.form.setControl(
            'audio',
            new FormControl<any | null>(null, [Validators.required])
          );
          this.showAudioUpload = true;
        } else {
          this.showAudioUpload = false;
          this.form.removeControl('audio');
        }
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  handleSearchCollection(value: string) {
    this.loadingCollections = true;
    this.collectionSearchChange$.next(value);
  }

  beforeUpload(
    file: NzUploadFile,
    _fileList: NzUploadFile[]
  ): Observable<boolean> {
    return Utils.beforeAudioUpload(this.messageService, file, _fileList);
  }

  handleChange(info: { file: NzUploadFile }): void {
    switch (info.file.status) {
      case 'uploading':
        break;
      case 'done':
        this.form.patchValue({
          audio: {
            publicId: info.file.response.publicId,
            url: info.file.response.secureUrl,
          },
        });
        this.uploadError = '';
        break;
      case 'error':
        this.messageService.error('Network error');
        break;
    }
  }

  submitForm(): void {
    if (this.form.valid) {
      const { audio, categorySkillId, finalTestId } = this.form.value;
      console.log('this.form.value: ', this.form.value);

      const categorySkill = this.categorySkills.find(
        (ck) => ck.id === categorySkillId
      );

      this.testService
        .create({
          categorySkillId: categorySkillId ?? 0,
          finalTestId: finalTestId ?? 0,
          name: this.form.get('name')?.getRawValue(),
          ...(categorySkill?.skill === Skill.Listening && audio
            ? { audio }
            : null),
        })
        .subscribe((value) => {
          if (value) {
            this.form.reset();
            this.fileList = [];
          }
        });
    } else {
      Object.values(this.form.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });

      if (this.form.get('audio')?.invalid) {
        this.uploadError = 'error';
      } else {
        this.uploadError = '';
      }
    }
  }
}
