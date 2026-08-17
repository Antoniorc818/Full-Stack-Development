import { Routes } from '@angular/router';
import { TripsComponent } from './trips/trips.component';
import { TripEdit } from './trip-edit/trip-edit.component';
import { LoginComponent } from './login/login.component';
import { ReportsComponent } from './reports/reports.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'trips', component: TripsComponent },
  { path: 'add-trip', component: TripEdit },
  { path: 'edit-trip/:tripCode', component: TripEdit },
  { path: 'reports', component: ReportsComponent },
  { path: 'login', component: LoginComponent }
];