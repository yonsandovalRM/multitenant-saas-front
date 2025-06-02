import { Routes } from '@angular/router';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./layout/layout.component').then((m) => m.LayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./dashboard/dashboard.component').then(
            (m) => m.DashboardComponent,
          ),
        title: 'Dashboard',
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./profile/profile.component').then((m) => m.ProfileComponent),
        title: 'Profile',
      },
      {
        path: 'users',
        loadComponent: () =>
          import('./users/users.component').then((m) => m.UsersComponent),
        title: 'Users',
      },
    ],
  },
];
