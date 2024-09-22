import { Route } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { AccountComponent } from './account/account.component';
import { DoctorsComponent } from './doctors/doctors.component';
import { SearchComponent } from './search/search.component'

export const routes: Route[] = [
  { path: '', component: HomeComponent },
  { path: 'account', component: AccountComponent },
  { path: 'doctors', component: DoctorsComponent },
  { path: 'search', component: SearchComponent },
  { path: '**', component: NotFoundComponent } // مسیر 404
];
