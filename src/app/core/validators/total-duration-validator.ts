import { AbstractControl, FormArray, ValidationErrors, ValidatorFn } from "@angular/forms";

function totalDurationValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const testTypeDuration = control.get("duration")?.value;
    const parts = control.get("parts") as FormArray;
    const totalQuestions = parts.controls.reduce((total, current) => total + current.get("duration")?.value, 0);

    return totalQuestions !== testTypeDuration ? {totalDuration: true} : null
  }
}

export default totalDurationValidator;