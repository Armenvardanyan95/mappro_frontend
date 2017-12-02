import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { MdSnackBar } from '@angular/material';

import { UserService } from 'app/common/services';

@Component({
  selector: 'app-user-delete',
  templateUrl: 'user-delete.component.html',
  styleUrls: ['user-delete.component.css']
})
export class UserDeleteComponent implements OnInit {

  users: number[];
  confirmed: boolean = false;
  @Output() dialogClosed: EventEmitter<boolean> = new EventEmitter();
  @Output() userDeleted: EventEmitter<boolean> = new EventEmitter();

  constructor(private userService: UserService, private snackbar: MdSnackBar) { }

  ngOnInit() {

  }

  reject() {
    this.dialogClosed.emit(true);
  }

  delete(password: string) {
    this.userService.delete({password: password, ids: this.users})
      .subscribe(
        res => this.userDeleted.emit(true),
        err => this.snackbar.open(err.json().message, 'OK')
      );
  }

}
