
import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { AuthGuard } from './services/auth.guard';
import { CreateFormComponent } from './create-form/create-form.component';
import { ViewDataComponent } from './view-data/view-data.component';
import { FillFormComponent } from './fill-form/fill-form.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { 
    path: 'user-dashboard', 
    component: UserDashboardComponent, 
    canActivate: [AuthGuard], 
    data: { roles: ['USER'] } 
  },
  { 
    path: 'admin-dashboard', 
    component: AdminDashboardComponent, 
    canActivate: [AuthGuard], 
    data: { roles: ['ADMIN'] } 
  },
  { path: 'create-form', component: CreateFormComponent, canActivate: [AuthGuard], data: { roles: ['ADMIN'] } },
  { path: 'view-data/:templateId', component: ViewDataComponent, canActivate: [AuthGuard], data: { roles: ['ADMIN'] } },
  { path: 'fill-form/:templateId', component: FillFormComponent, canActivate: [AuthGuard], data: { roles: ['ADMIN'] } },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }  // ✅ LAST route
];
