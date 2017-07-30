import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {Response} from "@angular/http";
import {MdSnackBar} from '@angular/material';
import {LocalStorageService} from 'angular-2-local-storage';

import {UserService} from 'app/common/services';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public form: FormGroup;
  public submitted: boolean = false;

  constructor(private formBuilder: FormBuilder, private userService: UserService,
              private localStorage: LocalStorageService, private router: Router, private snackBar: MdSnackBar) {
    this.form = formBuilder.group({
      'password': ['', Validators.required],
      'username': ['', Validators.required],
    });
  }

  ngOnInit() {
  }

  onSubmit(values: IUserAuth): void {
    this.submitted = true;
    if (this.form.valid) {
      this.userService.authenticate(values).subscribe(
        (res: {token: string}) => {
          this.localStorage.set('token', res.token);
          this.router.navigateByUrl('admin');
        },
        (err: Response) => {
          const errors = err.json()['non_field_errors'];
          this.snackBar.open(errors[0], 'OK');
      }
      );
    }
  }

}
