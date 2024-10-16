import { AsyncPipe } from '@angular/common';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import {
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { Observable, Subject, takeUntil } from 'rxjs';
import { SubmitStatus } from '../../../../shared/models/common';
import { Skill } from '../../../../shared/models/enum';
import { Utils } from '../../../../shared/utils/utils';
import { Category } from '../../models/category.model';
import CategoryActions from '../../store/category.action';
import { CategorySelect } from '../../store/category.selector';

@Component({
  selector: 'app-create-and-update',
  standalone: true,
  imports: [
    NzButtonModule,
    NzIconModule,
    NzDrawerModule,
    NzFormModule,
    NzInputModule,
    ReactiveFormsModule,
    NzSelectModule,
    AsyncPipe,
  ],
  templateUrl: './create-and-update.component.html',
  styleUrl: './create-and-update.component.scss',
})
export class CreateAndUpdateComponent implements OnInit, OnDestroy {
  @Input() drawerVisible = false;
  @Output() drawerVisibleChange = new EventEmitter<boolean>();

  drawerTitle = 'Create';
  skills = Skill;
  skillValues = Object.values(this.skills)
  .filter((i) => Number(i))
  .map((i) => parseInt(i as string) ?? 0);
  categoryId = 0;
  
  categories: Category[] = [];
  isSubmitting$!: Observable<boolean>;
  submitStatus$!: Observable<SubmitStatus>;

  private unsubscribe$ = new Subject<void>();

  constructor(
    private fb: NonNullableFormBuilder,
    private store: Store,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.store
      .select(CategorySelect.categories)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((value) => {
        this.categories = value;
        if (this.categoryId && this.form.pristine) {
          this.loadCategory();
        }
      });

    this.isSubmitting$ = this.store
      .select(CategorySelect.isSubmitting)
      .pipe(takeUntil(this.unsubscribe$));

    this.store
      .select(CategorySelect.submitStatus)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((status) => {
        if (this.drawerVisible && status === 'success') {
          this.form.reset();
          this.close();
        }
      });

    this.route.paramMap
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((params) => {
        this.categoryId = Number(params.get('code')?.split('-').pop() ?? 0);
        if (this.categoryId) {
          this.drawerTitle = 'Update';
          this.open();
        }
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  ngOnChanges(changes: SimpleChanges): void {
    for (const inputName in changes) {
      if (inputName === "drawerVisible") {
        const inputValues = changes[inputName];
        if (inputValues.currentValue && this.categoryId) {
          this.loadCategory();
          break;
        }
      }
    }
  }

  form: FormGroup<{
    name: FormControl<string>;
    skills: FormControl<number[]>;
    parent: FormControl<number>;
  }> = this.fb.group({
    name: ['', [Validators.required]],
    skills: [[] as number[]],
    parent: [0],
  });

  open() {
    this.drawerVisible = true;
    setTimeout(() => {
      this.drawerVisibleChange.emit(this.drawerVisible);
      
    });
  }

  close() {
    this.drawerVisible = false;
    this.drawerVisibleChange.emit(this.drawerVisible);

    this.form.reset();
  }

  loadCategory() {
    const category = Utils.findCategoryInTree(this.categories, this.categoryId);
    if (category) {
      this.form.setValue({
        name: category.name,
        skills: category.skills?.map(sk => sk.skill) ?? [],
        parent: category.parentId ?? 0,
      });
    }
  }

  submitForm(): void {
    if (this.form.valid) {
      const { name, parent, skills } = this.form.value;

      if (this.categoryId) {
        this.store.dispatch(CategoryActions.update({
          id: this.categoryId,
          name: name ?? '',
          parentId: parent === 0 ? undefined : parent,
          skills,
        }))
      } else {
        this.store.dispatch(
          CategoryActions.create({
            name: name ?? '',
            parentId: parent === 0 ? undefined : parent,
            skills,
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
