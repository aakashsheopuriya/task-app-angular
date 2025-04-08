import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { LoginComponent } from './page/login/login.component';
import { SignupComponent } from './page/signup/signup.component';
import { DashboardComponent } from './page/dashboard/dashboard.component';
import { authGuard } from './guard/auth.guard';
import { tokenGuard } from './guard/token.guard';
import { HomeComponent } from './page/home/home.component';
import { AddTaskComponent } from './page/add-task/add-task.component';
import { TaskComponent } from './page/task/task.component';
import { UserProfileComponent } from './page/user-profile/user-profile.component';
import { EditUserProfileComponent } from './page/edit-user-profile/edit-user-profile.component';
import { NoPageFoundComponent } from './page/no-page-found/no-page-found.component';

export const routes: Routes = [
    {path:'',component:AppComponent, canActivate:[authGuard]},
    {path:'login',component:LoginComponent},
    {path:'home',component:HomeComponent},
    {path:'signup',component:SignupComponent},
    {path:'dashboard',component:DashboardComponent , canActivate:[tokenGuard]},
    {path:'add-task',component:AddTaskComponent , canActivate:[tokenGuard]},
    {path:'task', loadComponent: ()=> import('./page/task/task.component').then(m=>m.TaskComponent) , canActivate:[tokenGuard]},
    {path:'task',component:TaskComponent , canActivate:[tokenGuard]},
    {path:'user-profile',loadComponent: ()=>import('./page/user-profile/user-profile.component').then(m=>m.UserProfileComponent) , data: { preload: true }},
    // {path:'user-profile',component:UserProfileComponent, canActivate:[tokenGuard]},
    {path:'edit-user-profile',component:EditUserProfileComponent , canActivate:[tokenGuard]},
    {path:'**',component:NoPageFoundComponent,}
];
