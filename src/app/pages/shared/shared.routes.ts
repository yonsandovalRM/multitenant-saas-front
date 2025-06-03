import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { SharedLayoutComponent } from './shared-layout/shared-layout.component';
import { PricingComponent } from './pricing/pricing.component';

export const SHARED_ROUTES: Routes = [
  {
    path: '',
    component: SharedLayoutComponent,
    pathMatch: 'full',
    children: [
      {
        path: '',
        component: HomeComponent,
      },
      {
        path: 'pricing',
        component: PricingComponent,
      },
    ],
  },
];
