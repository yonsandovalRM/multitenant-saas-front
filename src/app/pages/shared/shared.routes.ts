import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';

export const SHARED_ROUTES: Routes = [
  {
    path: '',
    component: HomeComponent,
    pathMatch: 'full',
    title: 'Home',
  },
  {
    path: 'pricing',
    loadComponent: () =>
      import('./pricing/pricing.component').then((m) => m.PricingComponent),
    title: 'Pricing',
  },
];
