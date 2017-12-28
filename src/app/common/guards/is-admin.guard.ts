import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { LocalStorageService } from 'angular-2-local-storage';

@Injectable()
export class IsAdminGuard implements CanActivate {

  constructor(private localStorage: LocalStorageService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    const isAdmin: boolean = this.localStorage.get<boolean>('isAdmin');
    if (isAdmin) {
      return true
    } else {
      this.router.navigate(['/dashboard']);
    }
  }
}
