import { Routes } from '@angular/router';
import {LoginComponent} from './pages/login/login.component';
import {SignupComponent} from './pages/signup/signup.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  // { path: 'employees', component: EmployeeListComponent },
  // { path: 'employee/add', component: EmployeeFormComponent },
  // { path: 'employee/:id', component: EmployeeDetailComponent },
  // { path: 'employee/edit/:id', component: EmployeeFormComponent },
  // Add wildcard route for a 404 page if needed
  { path: '**', redirectTo: '/login' }
];
