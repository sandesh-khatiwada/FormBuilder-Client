
import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { AuthGuard } from './services/auth.guard';
import { CreateFormComponent } from './create-form/create-form.component';
import { ViewDataComponent } from './view-data/view-data.component';
import { FillFormComponent } from './fill-form/fill-form.component';
import { UserViewDataComponent } from './user-view-data/user-view-data.component';
import { UserFillFormComponent } from './user-fill-form/user-fill-form.component';
import { UserEditFormComponent } from './user-edit-form/user-edit-form.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  // user routes
  { 
    path: 'user-dashboard', 
    component: UserDashboardComponent, 
    canActivate: [AuthGuard], 
    data: { roles: ['USER'] } 
  },
      {
    path: 'user-view-data/:templateId',
    component: UserViewDataComponent,
    canActivate: [AuthGuard],
    data: { roles: ['USER'] }
  },

    {
    path: 'user-fill-form/:templateId',
    component: UserFillFormComponent,
    canActivate: [AuthGuard],
    data: { roles: ['USER'] }
  },

{ 
  path: 'user-edit-form/:formDataId/:templateId', 
  component: UserEditFormComponent, 
  canActivate: [AuthGuard], 
  data: { roles: ['USER'] } 
},

  // admin routes
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
  { path: '**', redirectTo: '/login' }  
];
