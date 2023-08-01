import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@_core/guards';
import { Role, RoleGroup } from '@_core/models/role';

import { AppNotfoundComponent } from '@_shared/full-layout/app.notfound.component';
import { AppErrorComponent } from '@_shared/full-layout/app.error.component';
import { AppAccessdeniedComponent } from '@_shared/full-layout/app.accessdenied.component';
import { AppLoginComponent } from '@_shared/full-layout/app.login.component';

import { AppMainComponent } from './app.main.component';
import { AngularSiteComponent } from './angularsite/angularsite.component';
import { RegisterComponent } from './users/register/register.component';
import { UserManagementComponent } from './users/user-management/user-management.component';


const routes: Routes = [{
    path: '', component: AppMainComponent, canActivate: [AuthGuard], data: { allowedRoles: RoleGroup.Admins },
    children: [
      {path: '', component: AngularSiteComponent},
      {path: 'project', component: AngularSiteComponent},
      {path: 'setting', component: AngularSiteComponent},
      {path: 'newuser', component: RegisterComponent},
      {path: 'users'  , component: UserManagementComponent},
    ]
  },
  {path: 'error', component: AppErrorComponent},
  {path: 'accessdenied', component: AppAccessdeniedComponent},
  {path: 'notfound', component: AppNotfoundComponent},
  {path: 'login', component: AppLoginComponent},
  {path: '**', redirectTo: '/notfound'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{onSameUrlNavigation: 'reload', scrollPositionRestoration: 'enabled'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
