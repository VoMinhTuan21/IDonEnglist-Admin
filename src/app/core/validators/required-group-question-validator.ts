import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";
import { Utils } from "@shared/utils/utils";

export function requiredAllFields(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {

    if (isEmpty(control.value)) {
      return { required: true };
    }

    if (Utils.isObjectHasEmptyField(control.value)) {
      return { required: true };
    }
    return null;
  }
}

function isEmpty(value: any) {
  // Check for null or undefined
  if (value === null || value === undefined) {
      return true;
  }

  // Check for empty string
  if (typeof value === 'string' && value.trim() === '') {
      return true;
  }

  // Check for empty object
  if (typeof value === 'object' && Object.keys(value).length === 0) {
      return true;
  }

  return false; // Not empty
}
