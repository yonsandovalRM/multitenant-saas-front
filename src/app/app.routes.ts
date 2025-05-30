import { Routes } from '@angular/router';
import { NotFoundComponent } from '@/pages/shared/not-found/not-found.component';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./pages/shared/shared.routes').then((m) => m.SHARED_ROUTES),
  },
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./pages/admin/admin.routes').then((m) => m.ADMIN_ROUTES),
    canActivate: [authGuard],
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('./pages/auth/auth.routes').then((m) => m.AUTH_ROUTES),
  },

  {
    path: '**',
    component: NotFoundComponent,
    title: 'Not Found',
  },
];
