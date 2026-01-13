import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { LayoutComponent } from './layout/layout.component';
import { inject } from '@angular/core';
import { StorageService } from './core/services/storage.service';
import { Router } from '@angular/router';

const authGuard = () => {
  const storage = inject(StorageService);
  const router = inject(Router);
  if (storage.isLoggedIn()) return true;
  return router.parseUrl('/login');
};

const roleGuard = (requiredRole: string) => {
  const storage = inject(StorageService);
  const router = inject(Router);
  const user = storage.getUser(); // Assuming getUser returns object with role

  if (storage.isLoggedIn() && user?.role === requiredRole) {
    return true;
  }
  // Redirect to appropriate dashboard or login
  if (storage.isLoggedIn()) {
    return user?.role === 'ADMIN'
      ? router.parseUrl('/admin/dashboard')
      : router.parseUrl('/cobrador/dashboard');
  }
  return router.parseUrl('/login');
};

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: 'admin',
    component: LayoutComponent,
    canActivate: [() => roleGuard('ADMIN')],
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/dashboard.component').then(
            (m) => m.DashboardComponent
          ),
      },
      {
        path: 'rutas',
        loadComponent: () =>
          import('./features/loans/route-list.component').then(
            (m) => m.RouteListComponent
          ),
      },
      // {
      //   path: 'auditoria',
      //   loadComponent: () =>
      //     import('./features/audit/audit-list.component').then(
      //       (m) => m.AuditListComponent
      //     ),
      // },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
  {
    path: 'cobrador',
    component: LayoutComponent,
    canActivate: [() => roleGuard('COBRADOR')],
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/dashboard.component').then(
            (m) => m.DashboardComponent
          ), // Temporary reuse of main dashboard
      },
      {
        path: 'ruta-diaria',
        loadComponent: () =>
          import('./features/loans/route-list.component').then(
            (m) => m.RouteListComponent
          ),
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' },
];
