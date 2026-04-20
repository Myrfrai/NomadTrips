import { Routes } from '@angular/router';

import { ContactsComponent } from './contacts/contacts.component';
import { authGuard } from './core/auth.guard';
import { LoginComponent } from './login/login.component';
import { PopularComponent } from './popular/popular.component';
import { ProfileComponent } from './profile/profile.component';
import { TourDetailComponent } from './tour-detail/tour-detail.component';
import { TourListComponent } from './tour-list/tour-list.component';

export const routes: Routes = [
  { path: '', component: TourListComponent },
  { path: 'popular', component: PopularComponent },
  { path: 'contacts', component: ContactsComponent },
  { path: 'login', component: LoginComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [authGuard] },
  { path: 'tour/:id', component: TourDetailComponent },
  { path: '**', redirectTo: '' }
];
