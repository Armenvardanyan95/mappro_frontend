import { Component, OnInit } from '@angular/core';
import {MdDialog} from '@angular/material';

import {UserProfileComponent} from 'app/user-profile/user-profile.component';
import {UserListComponent} from "../user-list/user-list.component";

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
  entryComponents: [UserProfileComponent, UserListComponent]
})
export class FooterComponent implements OnInit {

  constructor(private dialog: MdDialog) {  }

  ngOnInit() {
  }

  openNewUserDialog() {
    const dialog = this.dialog.open(UserProfileComponent);
  }

  openAllUsersDialog() {
    const dialog = this.dialog.open(UserListComponent);
  }

}
