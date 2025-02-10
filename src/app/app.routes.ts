import { Routes } from '@angular/router';
import { HomeComponent } from './features/dashboard/home/home.component';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { AuthGuard } from './core/guards/auth.guard';
import { EditProfileComponent } from './features/profile/edit-profile/edit-profile.component';
import { ProfileResolver } from './core/resolvers/profile.resolver';
import { NoAuthGuard } from './core/guards/no-auth.guard';
import { CollectRequestComponent } from './features/requests/request-form/collect-request-form.component';
import { RequestListComponent } from './features/requests/request-list/request-list.component';
import { CollectProcessComponent } from './features/requests/collect-process/collect-process.component';
import { unsavedChangesGuard } from './core/guards/unsaved-changes.guard';
import { RequestsResolver } from './core/guards/requests.resolver';

export const routes: Routes = [
    // { path: 'home', component: HomeComponent },
    // { path: 'profile', component: EditProfileComponent, canActivate: [authGuard], resolve: { user: ProfileResolver } },
    // { path: 'requests', component: RequestListComponent},
    // { path: 'requests/add-collect-request', component: CollectRequestComponent},
    // { path: 'requests/edit-collect-request/:id', component: CollectRequestComponent },
    // { path: 'collect-process/:id', component: CollectProcessComponent},

    
    // { path: 'login', component: LoginComponent },
    // { path: 'register', component: RegisterComponent},
    // { path: '', redirectTo: '/home', pathMatch: 'full' }


    { path: 'home', component: HomeComponent, canActivate: [NoAuthGuard] }, 
    { path: 'profile', component: EditProfileComponent, canActivate: [AuthGuard], resolve: { user: ProfileResolver } },
    { path: 'requests', component: RequestListComponent, resolve: { requests: RequestsResolver } },
    { path: 'requests/add-collect-request', component: CollectRequestComponent, canDeactivate: [unsavedChangesGuard] },
    { path: 'requests/edit-collect-request/:id', component: CollectRequestComponent, canDeactivate: [unsavedChangesGuard] },
    { path: 'collect-process/:id', component: CollectProcessComponent, canDeactivate: [unsavedChangesGuard] },
  
    { path: 'login', component: LoginComponent, canActivate: [NoAuthGuard] },
    { path: 'register', component: RegisterComponent, canActivate: [NoAuthGuard] },
    { path: '', redirectTo: '/home', pathMatch: 'full' }
];
