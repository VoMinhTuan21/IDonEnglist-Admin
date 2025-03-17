import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, ParamMap, RouterLink } from '@angular/router';
import { CategorySkillService } from '@features/category-skill/category-skill.service';
import {
  CreateTestTypeRequest,
  ITestPartDetail,
  TestTypeDetail,
  UpdateTestTypeRequest
} from '@features/test-configuration/models/test-configuration';
import { TestConfigurationService } from '@features/test-configuration/test-configuration.service';
import { bootstrapPatchPlusFill } from '@ng-icons/bootstrap-icons';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { BoxComponent } from '@shared/components/box/box.component';
import { Skill } from '@shared/models/enum';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  of,
  Subject,
  take,
  takeUntil,
} from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-category-skill-config',
  imports: [
    BoxComponent,
    NzFormModule,
    ReactiveFormsModule,
    NzGridModule,
    NzInputModule,
    NzSelectModule,
    NzTableModule,
    FormsModule,
    NzInputNumberModule,
    NzButtonModule,
    NzIconModule,
    NzFlexModule,
    NgIcon,
    NzToolTipModule,
    NzPopconfirmModule,
    NzEmptyModule,
    RouterLink,
  ],
  providers: [provideIcons({ bootstrapPatchPlusFill })],
  templateUrl: './category-skill-config.component.html',
  styleUrl: './category-skill-config.component.scss',
})
export class CategorySkillConfigComponent implements OnInit {
  // ** Variables **
  private unsubscribe$ = new Subject<void>();

  categorySkillId = 0;
  testTypeId = 0;

  form = new FormGroup({
    name: new FormControl<string>('', Validators.required),
    numberOfQuestions: new FormControl<number>(0),
    duration: new FormControl<number>(0),
    categorySkill: new FormControl(
      { value: '', disabled: true },
      Validators.required
    ),
    parts: new FormArray([
      new FormGroup({
        id: new FormControl<number | string>(uuidv4(), Validators.required),
        name: new FormControl('', Validators.required),
        numberOfQuestions: new FormControl(0, Validators.min(1)),
        duration: new FormControl(0, Validators.min(1)),
      }),
    ]),
  });

  // ** Lifecycle **
  constructor(
    private categorySkillService: CategorySkillService,
    private route: ActivatedRoute,
    private testConfigurationService: TestConfigurationService,
    private messageService: NzMessageService
  ) {
    console.log("messageService: ", messageService);

  }

  ngOnInit(): void {
    this.route.paramMap
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((params) => {
        this.categorySkillId = this.extractCategorySkillId(params);

        if (this.categorySkillId) {
          this.loadTestTypeDetails(this.categorySkillId);
        }
      });

    this.form.valueChanges
      .pipe(
        takeUntil(this.unsubscribe$),
        distinctUntilChanged(),
        debounceTime(300)
      )
      .subscribe((values) => {
        this.form.patchValue({
          numberOfQuestions: values.parts?.reduce(
            (total, current) => total + (current.numberOfQuestions ?? 0),
            0
          ),
          duration: values.parts?.reduce(
            (total, current) => total + (current.duration ?? 0),
            0
          ),
        });
      });
  }

  // ** Methods **
  get parts() {
    return this.form.get('parts') as FormArray;
  }

  extractCategorySkillId(params: ParamMap): number {
    return Number(params.get('categorySkillSlug')?.split('-').pop());
  }

  loadTestTypeDetails(categorySkillId: number) {
    this.testConfigurationService
      .getDetail({ categorySkillId })
      .pipe(
        take(1),
        catchError((error) =>
          this.handleLoadTestTypeDetailsError(error, categorySkillId)
        )
      )
      .subscribe((testType) => {
        if (testType === null) {
          return;
        }

        this.testTypeId = testType.id;

        this.form.patchValue({
          name: testType.name,
          numberOfQuestions: testType.questions,
          duration: testType.duration,
          categorySkill: `${testType.categorySkill.category.name} - ${
            Skill[testType.categorySkill.skill]
          }`
        });

        this.parts.clear();
        testType.parts.forEach((part: ITestPartDetail) => {
          this.parts.push(
            new FormGroup({
              id: new FormControl(part.id),
              name: new FormControl(part.name),
              numberOfQuestions: new FormControl(part.questions),
              duration: new FormControl(part.duration),
            })
          );
        });
      });
  }

  handleLoadTestTypeDetailsError(error: any, categorySkillId: number) {
    if (error.status === 404) {
      this.loadCategorySkillDetails(categorySkillId);
    }
    return of(null);
  }

  loadCategorySkillDetails(categorySkillId: number) {
    this.categorySkillService
      .getDetails(categorySkillId)
      .pipe(take(1))
      .subscribe((categorySkill) => {
        this.form.patchValue({
          categorySkill: `${categorySkill.category.name} - ${
            Skill[categorySkill.skill]
          }`,
        });
      });
  }

  addPart() {
    this.parts.push(
      new FormGroup({
        id: new FormControl(uuidv4(), Validators.required),
        name: new FormControl('', Validators.required),
        numberOfQuestions: new FormControl(0, Validators.min(1)),
        duration: new FormControl(0, Validators.min(1)),
      })
    );
  }

  removePart(index: number) {
    this.parts.removeAt(index);
  }

  submit() {
    if (!this.form.valid) {
      Object.values(this.form.controls).forEach((control) => {
        if (control instanceof FormArray) {
          control.controls.forEach((group: FormGroup) => {
            Object.values(group.controls).forEach((nestedControl) => {
              if (nestedControl.invalid) {
                nestedControl.markAsDirty();
                nestedControl.updateValueAndValidity({ onlySelf: true });
              }
            });
          });
        } else if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });

      return;
    }

    const data: UpdateTestTypeRequest | CreateTestTypeRequest = {
      ...(this.testTypeId ? { id: this.testTypeId } : {}),
      name: this.form.value.name || '',
      duration: this.form.getRawValue().duration || 0,
      questions: this.form.getRawValue().numberOfQuestions || 0,
      categorySkillId: this.categorySkillId,
      parts:
        this.form.value.parts?.map((part, index) => ({
          ...(this.testTypeId ? { id: part.id?.toString() } : {}),
          name: part.name || '',
          questions: part.numberOfQuestions || 0,
          duration: part.duration || 0,
          order: index + 1,
        })) ?? [],
    };

    if (this.testTypeId) {
      this.testConfigurationService
        .update(data as UpdateTestTypeRequest)
        .pipe(take(1))
        .subscribe(this.handleSubmitSuccess);
    } else {
      this.testConfigurationService
        .create(data as CreateTestTypeRequest)
        .pipe(take(1))
        .subscribe(this.handleSubmitSuccess);
    }
  }

  handleSubmitSuccess(value: TestTypeDetail) {
    this.messageService?.success('Success!');
    this.testTypeId = value.id;

    this.form.patchValue({
      name: value.name,
      numberOfQuestions: value.questions,
      duration: value.duration,
      categorySkill: `${value.categorySkill.category.name} - ${
        Skill[value.categorySkill.skill]
      }`
    });

    this.parts.clear();
    value.parts.forEach((part: ITestPartDetail) => {
      this.parts.push(
        new FormGroup({
          id: new FormControl(part.id),
          name: new FormControl(part.name),
          numberOfQuestions: new FormControl(part.questions),
          duration: new FormControl(part.duration),
        })
      );
    });
  }
}
