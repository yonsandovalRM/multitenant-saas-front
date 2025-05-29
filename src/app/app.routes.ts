import { Routes } from '@angular/router';
import { HomeComponent } from './component/home/home.component';
import { NotFoundComponent } from './component/not-found/not-found.component';
import { DashboardComponent } from './component/dashboard/dashboard.component';
import { PricingComponent } from './component/pricing/pricing.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
  },
  {
    path: 'pricing',
    component: PricingComponent,
  },
  {
    path: '**',
    component: NotFoundComponent,
  },
];
