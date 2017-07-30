import { BrowserModule } from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import {HttpModule} from "@angular/http";
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Routes, RouterModule} from '@angular/router';

import {MdInputModule, MdToolbarModule, MdButtonModule, MdDatepickerModule,
  MdNativeDateModule, MdCardModule, MdDialogModule, MdSnackBarModule, MdSnackBar,
  MdSelectModule, MdAutocompleteModule, MdListModule} from '@angular/material';
import { AgmCoreModule } from '@agm/core';
import { LocalStorageModule } from 'angular-2-local-storage';
import {ColorPickerModule} from 'angular4-color-picker';

import { AppComponent } from './app.component';
import {UserService} from "./common/services/user.service";
import { AdminComponent } from './admin/admin.component';
import { HeaderComponent } from './header/header.component';
import { FormControlComponent } from './form-control/form-control.component';
import { FooterComponent } from './footer/footer.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { UserListComponent } from './user-list/user-list.component';
import { LoginComponent } from './login/login.component';
import {AuthGuard} from "./common/guards/auth.guard";
import { ColorMarkerComponent } from './color-marker/color-marker.component';
import {ColorMarkerService} from "./common/services/color.service";
import {environment} from "../environments/environment";
import {GoogleMapsService} from "./common/services/google.maps.service";
import {MdMultiselect} from "md-multiselect";
import {OrderService} from "./common/services/order.service";
import { OrderEditComponent } from './order-edit/order-edit.component';
import { OrderViewComponent } from './order-view/order-view.component';


const routes: Routes = [
  {path: '', redirectTo: 'login', pathMatch: 'full'},
  {path: 'login', component: LoginComponent},
  {path: 'admin', component: AdminComponent, canActivate: [AuthGuard]}
];


@NgModule({
  declarations: [
    AppComponent,
    AdminComponent,
    HeaderComponent,
    FormControlComponent,
    FooterComponent,
    UserProfileComponent,
    UserListComponent,
    LoginComponent,
    ColorMarkerComponent,
    MdMultiselect,
    OrderEditComponent,
    OrderViewComponent
  ],
  entryComponents: [UserProfileComponent, UserListComponent, ColorMarkerComponent, OrderEditComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpModule,
    FormsModule,
    ReactiveFormsModule,
    MdInputModule,
    MdToolbarModule,
    MdButtonModule,
    MdNativeDateModule,
    MdDatepickerModule,
    MdDialogModule,
    MdSelectModule,
    MdSnackBarModule,
    MdAutocompleteModule,
    MdCardModule,
    MdListModule,
    ColorPickerModule,
    AgmCoreModule.forRoot({
      apiKey: environment.googleMapsApiKey
    }),
    LocalStorageModule.withConfig({
      prefix: 'map-pro',
      storageType: 'localStorage'
    }),
    RouterModule.forRoot(routes)
  ],
  providers: [UserService, MdSnackBar, AuthGuard, ColorMarkerService, GoogleMapsService, OrderService],
  bootstrap: [AppComponent]
})
export class AppModule { }
