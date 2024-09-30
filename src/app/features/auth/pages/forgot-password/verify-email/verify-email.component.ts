import { Component, EventEmitter, Output } from '@angular/core';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { FormControl, FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-verify-email',
  standalone: true,
  imports: [
    NzAlertModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzIconModule,
    NzToolTipModule,
    ReactiveFormsModule
  ],
  templateUrl: './verify-email.component.html',
  styleUrl: './verify-email.component.scss',
})
export class VerifyEmailComponent {
  constructor(private fb: NonNullableFormBuilder) {}

  @Output() verified = new EventEmitter<void>();

  form: FormGroup<{
    email: FormControl<string>;
    code: FormControl<string>;
  }> = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    code: ['', [Validators.required, Validators.maxLength(6), Validators.minLength(6)]]
  });

  onSubmit() {
    if (this.form.valid) {
      console.log('submit', this.form.value);
      this.verified.emit();
    } else {
      Object.values(this.form.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }
}
