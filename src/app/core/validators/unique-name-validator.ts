import { AbstractControl, FormArray, ValidatorFn } from '@angular/forms';

function uniqueNameValidator(parts: FormArray): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const name = control.value;
    const duplicate = parts.controls.some((part) => part.get('name')?.value === name && part !== control.parent);
    return duplicate ? { uniqueName: { value: name } } : null;
  };
}

export default uniqueNameValidator;
