import { Component, OnInit } from '@angular/core';

import {UserService} from 'app/common/services';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {

  users: Array<IUser> = [];

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.userService.all().subscribe((res: Array<IUser>) => this.users = res);
  }

}
