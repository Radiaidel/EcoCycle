import { Routes } from '@angular/router';
import { HomeComponent } from './features/dashboard/home/home.component';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { authGuard } from './core/guards/auth.guard';
import { EditProfileComponent } from './features/profile/edit-profile/edit-profile.component';
import { ProfileResolver } from './core/resolvers/profile.resolver';
import { noAuthGuard } from './core/guards/no-auth.guard';

export const routes: Routes = [
    { path: 'home', component: HomeComponent},
    { path: 'profile', component: EditProfileComponent, canActivate: [authGuard], resolve: { user: ProfileResolver } },
  
    { path: 'login', component: LoginComponent, canActivate: [noAuthGuard] },
    { path: 'register', component: RegisterComponent, canActivate: [noAuthGuard] },
  
    { path: '', redirectTo: '/home', pathMatch: 'full' }

];
