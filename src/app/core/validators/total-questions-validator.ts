import { AbstractControl, FormArray, ValidationErrors, ValidatorFn } from "@angular/forms";

function totalQuestionsValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const testTypeQuestions = control.get("questions")?.value;
    const parts = control.get("parts") as FormArray;
    const totalQuestions = parts.controls.reduce((total, current) => total + current.get("questions")?.value, 0);

    return totalQuestions !== testTypeQuestions ? {totalQuestions: true} : null
  }
}

export default totalQuestionsValidator;