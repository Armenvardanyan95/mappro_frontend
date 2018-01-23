import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import {MatDialog, MatDialogRef} from '@angular/material';

import {UserProfileComponent} from 'app/user-profile/user-profile.component';
import {UserListComponent} from "../user-list/user-list.component";

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
  entryComponents: [UserProfileComponent, UserListComponent]
})
export class FooterComponent implements OnInit {

  @Output() userCreated: EventEmitter<IUser> = new EventEmitter();
  @Output() userDeleted: EventEmitter<boolean> = new EventEmitter();

  constructor(private dialog: MatDialog) {  }

  ngOnInit() {
  }

  openNewUserDialog() {
    const dialog: MatDialogRef<UserProfileComponent> = this.dialog.open(UserProfileComponent);
    dialog.componentInstance.userCreated.subscribe((user: IUser) => {
      dialog.close();
      this.userCreated.emit(user);
    });
  }

  openAllUsersDialog() {
    const dialog = this.dialog.open(UserListComponent);
    dialog.componentInstance.userDeleted.subscribe(() => {
      dialog.close();
      this.userDeleted.emit(true);
    });
    dialog.componentInstance.navigatedFrom.subscribe(() => dialog.close());
  }

}
