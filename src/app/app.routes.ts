import { Routes } from '@angular/router';
import { HomeComponent } from './features/dashboard/home/home.component';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { authGuard } from './core/guards/auth.guard';
import { EditProfileComponent } from './features/profile/edit-profile/edit-profile.component';
import { ProfileResolver } from './core/resolvers/profile.resolver';
import { noAuthGuard } from './core/guards/no-auth.guard';
import { CollectRequestComponent } from './features/requests/request-form/collect-request-form.component';
import { RequestListComponent } from './features/requests/request-list/request-list.component';

export const routes: Routes = [
    { path: 'home', component: HomeComponent },
    { path: 'profile', component: EditProfileComponent, canActivate: [authGuard], resolve: { user: ProfileResolver } },
    { path: 'requests', component: RequestListComponent, canActivate: [authGuard] },
    { path: 'requests/add-collect-request', component: CollectRequestComponent, canActivate: [authGuard] },
    { path: 'login', component: LoginComponent, canActivate: [noAuthGuard] },
    { path: 'register', component: RegisterComponent, canActivate: [noAuthGuard] },

    { path: '', redirectTo: '/home', pathMatch: 'full' }

];
