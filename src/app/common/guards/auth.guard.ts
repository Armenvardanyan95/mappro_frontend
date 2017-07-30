import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import {LocalStorageService} from 'angular-2-local-storage';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private localStorage: LocalStorageService, private router: Router) { }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot):  boolean {
    const token = this.localStorage.get<string>('token');
    if (token) {
      return true;
    } else {
      this.router.navigateByUrl('login');
    }
  }
}
