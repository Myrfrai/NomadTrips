import { Routes } from '@angular/router';

import { TourListComponent } from './tour-list/tour-list.component';
import { TourDetailComponent } from './tour-detail/tour-detail.component';
import { PopularComponent } from './popular/popular.component';
import { ContactsComponent } from './contacts/contacts.component';

export const routes: Routes = [
	{ path: '', component: TourListComponent },
	{ path: 'popular', component: PopularComponent },
	{ path: 'contacts', component: ContactsComponent },
	{ path: 'tour/:id', component: TourDetailComponent }
];
