import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {Response} from "@angular/http";
import {MatSnackBar, MatSnackBarConfig, MatDialog, MatDialogRef} from '@angular/material';

import {UserService} from 'app/common/services';
import {PasswordValidator} from 'app/common/validators';
import {UserDeleteComponent} from "../user-delete/user-delete.component";

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  public form: FormGroup;
  public submitted: boolean = false;
  @Input() user: IUser;
  @Output() public userCreated: EventEmitter<IUser> = new EventEmitter();
  @Output() public userDeleted: EventEmitter<boolean> = new EventEmitter();

  constructor(private formBuilder: FormBuilder, private userService: UserService,
              private snackBar: MatSnackBar, private dialog: MatDialog) {
    this.form = formBuilder.group({
      'id': [''],
      'firstName': ['', Validators.required],
      'lastName': ['', Validators.required],
      'username': ['', Validators.required],
      'email': ['', [Validators.required, Validators.email]],
      'password': ['', Validators.required],
      'confirmPassword': ['', Validators.required]
    }, {validator: PasswordValidator.validate('password', 'confirmPassword')});
  }

  ngOnInit() {
    if (this.user) {
      this.form.patchValue(this.user);
      this.form.controls['password'].clearValidators();
      this.form.controls['password'].patchValue('');
      this.form.controls['confirmPassword'].clearValidators();
    }
  }

  onSubmit(values: IUser): void {
    this.submitted = true;
    if (this.form.valid) {
      if (this.user) {
        return this.updateUser(values);
      }
      this.createUser(values);
    }
  }

  createUser(values: IUser): void {
    this.userService.create(values).subscribe(
      (res: IUser)=> this.success(res, 'created'),
      (err: Response) => this.error(err)
    );
  }

  updateUser(values: IUser): void {
    this.userService.update(values).subscribe(
      (res: IUser)=> this.success(res, 'updated'),
      (err: Response) => this.error(err)
    )
  }

  deleteUser() {
    const dialog: MatDialogRef<UserDeleteComponent> = this.dialog.open(UserDeleteComponent);
    dialog.componentInstance.users = [this.user.id];
    dialog.componentInstance.userDeleted.subscribe(() => {
      dialog.close();
      this.userDeleted.emit(true);
    });
    dialog.componentInstance.dialogClosed.subscribe(() => dialog.close());
  }

  private success(user: IUser, action: string): void {
    this.userCreated.emit(user);
  }

  private error(err: Response): void {
    const errors = err.json();
    for (const msg in errors) {
      if (errors.hasOwnProperty(msg)) {
        this.snackBar.open(errors[msg], 'OK', <MatSnackBarConfig>{duration: 3000});
      }
    }
  }

}
