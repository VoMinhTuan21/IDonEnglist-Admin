import { Component, EventEmitter, Output } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, NonNullableFormBuilder, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';

@Component({
  selector: 'app-create-new-pass',
  standalone: true,
  imports: [NzFormModule, NzInputModule, NzButtonModule, ReactiveFormsModule, NzFlexModule],
  templateUrl: './create-new-pass.component.html',
  styleUrl: './create-new-pass.component.scss'
})
export class CreateNewPassComponent {
  constructor(private fb: NonNullableFormBuilder) {}

  @Output() back = new EventEmitter<void>();

  validateConfirmPassword(): void {
    setTimeout(() => this.form.controls.confirmPassword.updateValueAndValidity());
  }

  confirmValidator: ValidatorFn = (control: AbstractControl) : {[index: string] : boolean} => {
    if (!control.value) {
      return { error: true, required: true };
    } else if (control.value !== this.form.controls.password.value) {
      return { confirm: true, error: true }
    }

    return {}
  }
  
  form: FormGroup<{
    password: FormControl<string>
    confirmPassword: FormControl<string>
  }> = this.fb.group({
    password: ["", [Validators.required]],
    confirmPassword: ["", [this.confirmValidator]],
  });

  onSubmit(): void {
    if (this.form.valid) {
      console.log('submit', this.form.value);
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
