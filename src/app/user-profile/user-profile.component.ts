import { Component, OnInit } from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {Response} from "@angular/http";
import {MdSnackBar, MdSnackBarConfig} from '@angular/material';

import {UserService} from 'app/common/services';
import {PasswordValidator} from 'app/common/validators';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  public form: FormGroup;
  public submitted: boolean = false;

  constructor(private formBuilder: FormBuilder, private userService: UserService, private snackBar: MdSnackBar) {
    this.form = formBuilder.group({
      'firstName': ['', Validators.required],
      'lastName': ['', Validators.required],
      'username': ['', Validators.required],
      'email': ['', [Validators.required, Validators.email]],
      'password': ['', Validators.required],
      'confirmPassword': ['', Validators.required]
    }, PasswordValidator.validate('password', 'confirmPassword'));
  }

  ngOnInit() {
  }

  onSubmit(values: IUser): void {
    this.submitted = true;
    if (this.form.valid) {
      this.userService.create(values).subscribe(
        res => this.snackBar.open('User Successfully created', 'OK', <MdSnackBarConfig>{duration: 3000}),
        (err: Response) => {
          const errors = err.json();
          for (const msg in errors) {
            if (errors.hasOwnProperty(msg)) {
              this.snackBar.open(errors[msg], 'OK', <MdSnackBarConfig>{duration: 3000});
            }
          }
        }
      );
    }
  }

}
