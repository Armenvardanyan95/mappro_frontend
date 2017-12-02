import {FormGroup, ValidatorFn} from "@angular/forms";

export class PasswordValidator {

  static validate(firstField: string, secondField: string): ValidatorFn {
    return (formGroup: FormGroup): {passwordsDontMatch: boolean} => {
      return formGroup.controls[firstField].value === formGroup.controls[secondField].value ? null : {
        passwordsDontMatch: true
      };
    }
  }

}
