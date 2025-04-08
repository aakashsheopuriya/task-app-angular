import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function confirmPasswordValidator(
  passwordname: string,
  confirmPasswordname: string
): ValidatorFn {
  return (form: AbstractControl): ValidationErrors | null => {
    let password = form.get(passwordname)?.value;
    let confirmPassword = form.get(confirmPasswordname)?.value;
    if (password !== confirmPassword) {
      return { passwordMismatch: true };
    } else {
      return null;
    }
  };
}
