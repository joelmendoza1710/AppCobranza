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

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      {
        path: 'clients',
        loadComponent: () =>
          import('./features/clients/client-list.component').then(
            (m) => m.ClientListComponent
          ),
      },
      {
        path: 'loans',
        loadComponent: () =>
          import('./features/loans/loan-list.component').then(
            (m) => m.LoanListComponent
          ),
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
  { path: '**', redirectTo: 'login' },
];
