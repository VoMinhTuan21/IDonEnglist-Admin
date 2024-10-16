import { AsyncPipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Category } from '@features/category/models/category.model';
import CategoryActions from '@features/category/store/category.action';
import { CategorySelect } from '@features/category/store/category.selector';
import { Store } from '@ngrx/store';
import { BoxComponent } from '@shared/components/box/box.component';
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
  map,
  Observable,
  Subject,
  takeUntil,
} from 'rxjs';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import {
  DragDropComponent,
  ItemDragDrop,
} from '@shared/components/drag-drop/drag-drop.component';
import { v4 as uuidv4 } from 'uuid';
import uniqueNameValidator from '@core/validators/unique-name-validator';
import { Skill } from '@shared/models/enum';
import totalQuestionsValidator from '@core/validators/total-questions-validator';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import totalDurationValidator from '@core/validators/total-duration-validator';
import { TestConfigurationSelect } from '@features/test-configuration/store/test-configuration.selector';
import { Router } from '@angular/router';
import { CreateTestPartRequest, CreateTestTypeRequest } from '@features/test-configuration/models/test-configuration';
import { TestConfigurationActions } from '@features/test-configuration/store/test-configuration.action';

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
    NzAlertModule
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
    categorySkillId: new FormControl(0, [Validators.required, Validators.min(1)]),
    questions: new FormControl(0, [Validators.required, Validators.min(1)]),
    parts: new FormArray([
      new FormGroup({
        id: new FormControl(uuidv4()),
        name: new FormControl('', Validators.required),
        duration: new FormControl(0, [Validators.required, Validators.min(1)]),
        questions: new FormControl(0, [Validators.required, Validators.min(1)]),
        order: new FormControl(1, Validators.required),
      }),
    ]),
    duration: new FormControl(0, [Validators.required, Validators.min(1)]),
  }, {validators: [totalQuestionsValidator(), totalDurationValidator()], updateOn: "blur"});
  isSubmitting$!: Observable<boolean>;

  constructor(private store: Store, private router: Router) {}

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
            id: part.id ?? '',
          })) ?? [];
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
        if (status === "success") {
          this.router.navigate(["test-configuration"])
        }
      })
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  get parts() {
    return this.form.get('parts') as FormArray;
  }

  addTestPartForm() {
    const part = new FormGroup({
      id: new FormControl(uuidv4()),
      name: new FormControl('', Validators.required),
      duration: new FormControl(0, [Validators.required, Validators.min(1)]),
      questions: new FormControl(0, [Validators.required, Validators.min(1)]),
      order: new FormControl(this.parts.length + 1, [Validators.required]),
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
      const partsData: CreateTestPartRequest[] = this.form.value.parts?.map(p => ({
        duration: p.duration ?? 0,
        name: p.name ?? "",
        order: p.order ?? 0,
        questions: p.questions ?? 0
      })) ?? [];
       
      console.log("this.form.value: ", this.form.value);
      const data: CreateTestTypeRequest = {
        categorySkillId: this.form.value.categorySkillId ?? 0,
        duration: this.form.value.duration ?? 0,
        name: this.form.value.name ?? "",
        parts: partsData,
        questions: this.form.value.questions ?? 0
      }
      
      this.store.dispatch(TestConfigurationActions.create(data));
    } else {
      Object.values(this.form.controls).forEach((control) => {
        if (control instanceof FormArray) {
          // For FormArray (parts), we also mark the controls inside it as dirty
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
