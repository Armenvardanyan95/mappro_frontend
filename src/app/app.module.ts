import { BrowserModule } from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import {HttpModule} from '@angular/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Routes, RouterModule} from '@angular/router';
import {AccordionModule, DataTableModule, ButtonModule,
    DropdownModule, CalendarModule, MultiSelectModule, DataListModule, PanelModule, MenubarModule, OverlayPanelModule, ChipsModule} from 'primeng/primeng';

import {
  MdInputModule, MdToolbarModule, MdButtonModule, MdDatepickerModule,
  MdNativeDateModule, MdCardModule, MdDialogModule, MdSnackBarModule, MdSnackBar,
  MdSelectModule, MdAutocompleteModule, MdListModule, MdIconModule, MdCheckboxModule, MdChipsModule, MdSidenavModule
} from '@angular/material';
import { AgmCoreModule, MarkerManager, GoogleMapsAPIWrapper } from '@agm/core';
import { LocalStorageModule } from 'angular-2-local-storage';
import {ColorPickerModule} from 'angular4-color-picker';
import { AppComponent } from './app.component';
import {UserService} from './common/services/user.service';
import { AdminComponent } from './admin/admin.component';
import { HeaderComponent } from './header/header.component';
import { FormControlComponent } from './form-control/form-control.component';
import { FooterComponent } from './footer/footer.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { UserListComponent } from './user-list/user-list.component';
import { LoginComponent } from './login/login.component';
import {AuthGuard} from './common/guards/auth.guard';
import {IsAdminGuard} from './common/guards/is-admin.guard';
import { ColorMarkerComponent } from './color-marker/color-marker.component';
import {ColorMarkerService} from './common/services/color.service';
import {environment} from '../environments/environment';
import {GoogleMapsService} from './common/services/google.maps.service';
import {MdMultiselect} from 'md-multiselect';
import {OrderService} from './common/services/order.service';
import { OrderEditComponent } from './order-edit/order-edit.component';
import { OrderViewComponent } from './order-view/order-view.component';
import { CalendarComponent } from './calendar/calendar.component';
import { ColorMarkerDeleteComponent } from './color-marker-delete/color-marker-delete.component';
import { OrderDeleteComponent } from './order-delete/order-delete.component';
import { OrderDeleteByDateComponent } from './order-delete-by-date/order-delete-by-date.component';
import { MapPipe } from './common/pipes/map.pipe';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TimeAmPmPipe } from './common/pipes/time-am-pm.pipe';
import { ColorPipe } from './common/pipes/color.pipe';
import {IsNotAdminGuard} from './common/guards/is-not-admin.guard';
import { TableComponent } from './table/table.component';
import {UserDeleteComponent} from "./user-delete/user-delete.component";
import { OrdersByIDPipe } from './common/pipes/orders-by-id.pipe';


const routes: Routes = [
  {path: '', redirectTo: 'login', pathMatch: 'full'},
  {path: 'login', component: LoginComponent},
  {path: 'calendar', component: CalendarComponent, canActivate: [AuthGuard, IsAdminGuard]},
  {path: 'admin', component: AdminComponent, pathMatch: 'full', canActivate: [AuthGuard, IsAdminGuard]},
  {path: 'table', component: TableComponent, pathMatch: 'full', canActivate: [AuthGuard, IsAdminGuard]},
  {path: 'user/:id', component: DashboardComponent, canActivate: [AuthGuard, IsAdminGuard]},
  {path: 'dashboard', component: DashboardComponent, pathMatch: 'full', canActivate: [AuthGuard, IsNotAdminGuard]}
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
    UserDeleteComponent,
    ColorMarkerComponent,
    MdMultiselect,
    OrderEditComponent,
    OrderViewComponent,
    CalendarComponent,
    ColorMarkerDeleteComponent,
    OrderDeleteComponent,
    OrderDeleteByDateComponent,
    MapPipe,
    DashboardComponent,
    TimeAmPmPipe,
    ColorPipe,
    TableComponent,
    OrdersByIDPipe
  ],
  entryComponents: [UserProfileComponent, UserListComponent, UserDeleteComponent,
    ColorMarkerComponent, OrderEditComponent, ColorMarkerDeleteComponent, OrderDeleteComponent, OrderDeleteByDateComponent],
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
    MultiSelectModule,
    MdIconModule,
    MdSelectModule,
    AccordionModule,
    DataTableModule,
    MdSnackBarModule,
    MdChipsModule,
    MdAutocompleteModule,
    MdCardModule,
    MdSidenavModule,
    MdCheckboxModule,
    MdListModule,
    ColorPickerModule,
    CalendarModule,
    DataListModule,
    MenubarModule,
    DropdownModule,
    ButtonModule,
    PanelModule,
    OverlayPanelModule,
    ChipsModule,
    AgmCoreModule.forRoot({
      apiKey: environment.googleMapsApiKey,
      libraries: ['places'],
    }),
    LocalStorageModule.withConfig({
      prefix: 'map-pro',
      storageType: 'localStorage'
    }),
    RouterModule.forRoot(routes)
  ],
  providers: [UserService, MdSnackBar, AuthGuard, IsAdminGuard, IsNotAdminGuard, ColorMarkerService,
    GoogleMapsService, OrderService, MarkerManager, GoogleMapsAPIWrapper],
  bootstrap: [AppComponent]
})
export class AppModule { }
