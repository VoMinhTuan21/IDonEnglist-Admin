import { AsyncPipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import uniqueNameValidator from '@core/validators/unique-name-validator';
import { Category } from '@features/category/models/category.model';
import CategoryActions from '@features/category/store/category.action';
import { CategorySelect } from '@features/category/store/category.selector';
import {
  CreateTestTypeRequest,
  ITestPartDetail,
  UpdateTestTypeRequest
} from '@features/test-configuration/models/test-configuration';
import { TestConfigurationActions } from '@features/test-configuration/store/test-configuration.action';
import { TestConfigurationSelect } from '@features/test-configuration/store/test-configuration.selector';
import { TestConfigurationService } from '@features/test-configuration/test-configuration.service';
import { Store } from '@ngrx/store';
import { BoxComponent } from '@shared/components/box/box.component';
import {
  DragDropComponent,
  ItemDragDrop,
} from '@shared/components/drag-drop/drag-drop.component';
import { Skill } from '@shared/models/enum';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule, NzSelectOptionInterface } from 'ng-zorro-antd/select';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import {
  debounceTime,
  distinctUntilChanged,
  Observable,
  Subject,
  takeUntil,
} from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-create-test-configuration',
  standalone: true,
  imports: [
    BoxComponent,
    NzGridModule,
    NzFormModule,
    NzInputModule,
    NzSelectModule,
    AsyncPipe,
    ReactiveFormsModule,
    NzTypographyModule,
    NzButtonModule,
    NzFlexModule,
    NzIconModule,
    NzBreadCrumbModule,
    DragDropComponent,
    NzAlertModule,
  ],
  templateUrl: './create-test-configuration.component.html',
  styleUrl: './create-test-configuration.component.scss',
})
export class CreateTestConfigurationComponent implements OnInit, OnDestroy {
  categories$!: Observable<Category[]>;
  categoryListOptions: NzSelectOptionInterface[] = [];
  private unsubscribe$ = new Subject<void>();
  listPartNames: ItemDragDrop[] = [];
  form = new FormGroup({
    name: new FormControl('', [Validators.required]),
    categorySkillId: new FormControl(0, [
      Validators.required,
      Validators.min(1),
    ]),
    questions: new FormControl({ value: 0, disabled: true }, [
      Validators.required,
      Validators.min(1),
    ]),
    parts: new FormArray([
      new FormGroup({
        id: new FormControl(uuidv4()),
        name: new FormControl('', Validators.required),
        duration: new FormControl(0, [Validators.required, Validators.min(1)]),
        questions: new FormControl(0, [Validators.required, Validators.min(1)]),
        order: new FormControl(
          { value: 1, disabled: true },
          Validators.required
        ),
      }),
    ]),
    duration: new FormControl({ value: 0, disabled: true }, [
      Validators.required,
      Validators.min(1),
    ]),
  });
  isSubmitting$!: Observable<boolean>;
  testTypeId: number = 0;

  constructor(
    private store: Store,
    private router: Router,
    private route: ActivatedRoute,
    private testConfigurationService: TestConfigurationService
  ) {}

  ngOnInit(): void {
    this.store
      .select(CategorySelect.categories)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((categories) => {
        this.categoryListOptions = categories
          .map((c) => c.children ?? [])
          .flat()
          .filter((c) => c?.id)
          .map((c) => {
            if (c.skills?.length) {
              return c.skills.map((sk) => ({
                label: Skill[sk.skill],
                value: sk.id,
                groupLabel: c.name,
              }));
            }
            return [];
          })
          .flat();
      });

    this.store
      .select(CategorySelect.categories)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((categories) => {
        if (categories.length === 0) {
          this.store.dispatch(CategoryActions.getAll());
        }
      });

    this.form.valueChanges
      .pipe(
        takeUntil(this.unsubscribe$),
        debounceTime(1000),
        distinctUntilChanged()
      )
      .subscribe((values) => {
        this.listPartNames =
          values.parts?.map((part) => ({
            label: part.name ? part.name : 'No title',
            id: part.id?.toString() ?? uuidv4(),
          })) ?? [];

        this.form.patchValue({
          questions: values.parts?.reduce(
            (total, current) => total + (current.questions ?? 0),
            0
          ),
          duration: values.parts?.reduce(
            (total, current) => total + (current.duration ?? 0),
            0
          ),
        });
      });

    this.parts.controls.forEach((part) =>
      this.addUniqueNameValidator(part as FormGroup)
    );

    this.isSubmitting$ = this.store
      .select(TestConfigurationSelect.isSubmitting)
      .pipe(takeUntil(this.unsubscribe$));

    this.store
      .select(TestConfigurationSelect.submitStatus)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((status) => {
        if (status === 'success') {
          this.store.dispatch(TestConfigurationActions.resetSubmitStatus())
          this.router.navigate(['test-configuration']);
        }
      });

    this.route.paramMap
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((params) => {
        this.testTypeId = Number(params.get('id'));
        if (this.testTypeId) {
          this.testConfigurationService
            .getDetail(this.testTypeId)
            .subscribe((value) => {
              this.form.get("categorySkillId")?.disable();
              this.form.patchValue({
                name: value.name,
                questions: value.questions,
                categorySkillId: value.categorySkill.id,
                duration: value.duration,
              });

              this.parts.clear();
              value.parts.forEach((p) => {
                this.addTestPartForm(p);
              });
            });
        }
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  get parts() {
    return this.form.get('parts') as FormArray;
  }

  addTestPartForm(data?: ITestPartDetail) {
    const part = new FormGroup({
      id: new FormControl(data?.id.toString() ?? uuidv4()),
      name: new FormControl(data?.name ?? '', Validators.required),
      duration: new FormControl(data?.duration ?? 0, [
        Validators.required,
        Validators.min(1),
      ]),
      questions: new FormControl(data?.questions ?? 0, [
        Validators.required,
        Validators.min(1),
      ]),
      order: new FormControl(
        { value: data?.order ?? this.parts.length + 1, disabled: true },
        [Validators.required]
      ),
    });

    this.parts.push(part);
    this.addUniqueNameValidator(part);
  }

  removeItem(index: number) {
    this.parts.removeAt(index);
    this.updateOrderValues();
  }

  onSubmit(): void {
    if (this.form.valid) {
      const isUpdate = this.testTypeId !== 0;

      const partsData =
        this.form.controls['parts']?.controls.map((p) => ({
          ...(isUpdate ? { id: p.value.id ?? '' } : {}),
          duration: p.value.duration ?? 0,
          name: p.value.name ?? '',
          order: p.controls['order'].value ?? 0,
          questions: p.value.questions ?? 0,
        })) ?? [];

      const data = {
        ...(isUpdate ? { id: this.testTypeId } : {}),
        categorySkillId: this.form.controls['categorySkillId'].value ?? 0,
        duration: this.form.controls['duration'].value ?? 0,
        name: this.form.value.name ?? '',
        parts: partsData,
        questions: this.form.controls['questions'].value ?? 0,
      };

      if (isUpdate) {
        console.log("data: ", data);

        this.store.dispatch(TestConfigurationActions.update(data as UpdateTestTypeRequest));
      } else {
        this.store.dispatch(TestConfigurationActions.create(data as CreateTestTypeRequest));
      }
    } else {
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
    }
  }

  private updateOrderValues() {
    this.parts.controls.forEach((part, index) => {
      part.get('order')?.setValue(index + 1);
    });
  }

  private addUniqueNameValidator(partGroup: FormGroup) {
    partGroup
      .get('name')
      ?.setValidators([Validators.required, uniqueNameValidator(this.parts)]);
    partGroup.get('name')?.updateValueAndValidity(); // Update the validity after adding the validator
  }

  updateParts(listNames: ItemDragDrop[]) {
    this.listPartNames = listNames;
    this.parts.controls.sort((a, b) => {
      const aIndex = listNames.findIndex(
        (name) => a.get('id')?.value === name.id
      );
      const bIndex = listNames.findIndex(
        (name) => b.get('id')?.value === name.id
      );

      return aIndex - bIndex;
    });

    this.updateOrderValues();
  }
}
