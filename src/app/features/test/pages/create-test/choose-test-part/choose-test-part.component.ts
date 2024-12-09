import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TestPart } from '@features/test-part/models/test-part.model';
import TestActions from '@features/test/store/test.action';
import { TestSelect } from '@features/test/store/test.selector';
import { Store } from '@ngrx/store';
import { BoxComponent } from '@shared/components/box/box.component';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-choose-test-part',
  standalone: true,
  imports: [
    BoxComponent,
    NzRadioModule,
    FormsModule,
    NzFormModule,
    ReactiveFormsModule,
    NzButtonModule,
  ],
  templateUrl: './choose-test-part.component.html',
  styleUrl: './choose-test-part.component.scss',
})
export class ChooseTestPartComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject<void>();

  testParts: TestPart[] = [];

  form: FormGroup<{
    part: FormControl<number>;
  }> = this.fb.group({
    part: [0, [Validators.required, Validators.min(1)]],
  });

  constructor(
    private readonly fb: NonNullableFormBuilder,
    private readonly store: Store
  ) {}

  ngOnInit(): void {
    this.store.dispatch(
      TestActions.getListTestParts({ filter: { testTypeId: 1015 } })
    );
    this.store
      .select(TestSelect.testParts)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((value) => (this.testParts = value));
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  onSubmit(): void {
    console.log('this.form.valid: ', this.form.valid);
    if (this.form.valid) {
      this.store.dispatch(TestActions.setSelectedTestPartId({id: this.form.value.part ?? 0}))
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
