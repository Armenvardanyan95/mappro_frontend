import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import {MdSnackBar, MdSnackBarConfig, MdDialog, MdDialogRef} from '@angular/material';

import {UserService} from 'app/common/services';
import { UserProfileComponent } from 'app/user-profile/user-profile.component';
import {ContextMenu} from "primeng/components/contextmenu/contextmenu";

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {

  users: Array<IUser> = [];
  @Output() userDeleted: EventEmitter<boolean> = new EventEmitter();
  @Output() navigatedFrom: EventEmitter<boolean> = new EventEmitter();

  constructor(private userService: UserService, private dialog: MdDialog) { }

  ngOnInit() {
    this.userService.all().subscribe((res: Array<IUser>) => this.users = res);
  }

  showUserDialog(user: IUser, event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    const dialog: MdDialogRef<UserProfileComponent> = this.dialog.open(UserProfileComponent);
    dialog.componentInstance.user = user;
    dialog.componentInstance.userDeleted.subscribe(() => {
      dialog.close();
      this.userDeleted.emit(true)
    });
    dialog.componentInstance.userCreated.subscribe(() => {
      dialog.close();
      this.userDeleted.emit(true);
      this.ngOnInit();
    });
  }

  navigated(): void {
    this.navigatedFrom.emit(true);
  }

}
