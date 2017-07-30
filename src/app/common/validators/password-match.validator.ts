import {FormGroup, ValidatorFn} from "@angular/forms";

export class PasswordValidator {

  static validate(firstField: string, secondField: string): ValidatorFn {
    return (formGroup: FormGroup): {passwordsDontMatch: boolean} => {
      return formGroup[firstField] === formGroup[secondField] ? null : {
        passwordsDontMatch: true
      };
    }
  }

}
