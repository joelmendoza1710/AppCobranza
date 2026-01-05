import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoanService } from '../../core/services/loan.service';
import { Summary } from '../../core/models/api.models';
import { CreateLoanComponent } from '../loans/create-loan.component';
import { ExpensesWidgetComponent } from './expenses-widget.component';
import { RouteListComponent } from '../loans/route-list.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    CreateLoanComponent,
    ExpensesWidgetComponent,
    RouteListComponent,
  ],
  template: `
    <div class="space-y-6">
      <!-- Summary Cards Header -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Collected -->
        <div
          class="relative overflow-hidden bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl shadow-lg p-6 text-white transform hover:scale-[1.02] transition-transform duration-300"
        >
          <!-- Decorative Circle -->
          <div
            class="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl"
          ></div>

          <h3
            class="text-emerald-100 text-sm font-semibold uppercase tracking-wider"
          >
            Cobrado Hoy
          </h3>
          <div class="flex items-end space-x-2 mt-2">
            <p class="text-4xl font-bold">
              {{ summary?.collectedToday | currency }}
            </p>
            <span class="mb-1 text-emerald-200 text-sm font-medium"
              >+{{ 0 | percent }}</span
            >
            <!-- Placeholder for trend -->
          </div>
        </div>

        <!-- Expenses -->
        <div
          class="relative overflow-hidden bg-gradient-to-br from-rose-500 to-pink-600 rounded-2xl shadow-lg p-6 text-white transform hover:scale-[1.02] transition-transform duration-300"
        >
          <div
            class="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl"
          ></div>

          <h3
            class="text-rose-100 text-sm font-semibold uppercase tracking-wider"
          >
            Gastos
          </h3>
          <div class="flex items-end space-x-2 mt-2">
            <p class="text-4xl font-bold">
              -{{ summary?.expensesToday || 0 | currency }}
            </p>
          </div>
        </div>

        <!-- Net Cash -->
        <div
          class="relative overflow-hidden bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg p-6 text-white transform hover:scale-[1.02] transition-transform duration-300"
        >
          <div
            class="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl"
          ></div>

          <h3
            class="text-blue-100 text-sm font-semibold uppercase tracking-wider"
          >
            En Caja (Neto)
          </h3>
          <div class="flex items-end space-x-2 mt-2">
            <p class="text-4xl font-bold">
              {{ summary?.cashOnHand | currency }}
            </p>
          </div>
        </div>
      </div>

      <!-- Main Content Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Route List (Main - 2/3) -->
        <div class="lg:col-span-2 space-y-6">
          <div
            class="flex justify-between items-center bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm"
          >
            <h2
              class="text-xl font-bold text-gray-800 dark:text-white flex items-center"
            >
              <span class="w-2 h-6 bg-blue-500 rounded mr-3"></span>
              Operaciones
            </h2>
            <button
              (click)="showCreateLoan = true"
              class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 font-medium text-sm"
            >
              + Nuevo Préstamo
            </button>
          </div>
          <app-route-list (routeUpdated)="refreshData()"></app-route-list>
        </div>

        <!-- Expenses Widget (Sidebar - 1/3) -->
        <div class="lg:col-span-1">
          <app-expenses-widget
            (expenseAdded)="refreshData()"
          ></app-expenses-widget>
        </div>
      </div>

      <!-- Create Loan Modal -->
      <app-create-loan
        *ngIf="showCreateLoan"
        (onClose)="showCreateLoan = false"
        (onCreated)="onLoanCreated()"
      ></app-create-loan>
    </div>
  `,
})
export class DashboardComponent implements OnInit {
  @ViewChild(RouteListComponent) routeList!: RouteListComponent;
  summary: Summary | null = null;
  showCreateLoan = false;

  constructor(private loanService: LoanService) {}

  ngOnInit() {
    this.refreshData();
  }

  refreshData() {
    this.loanService.getSummary().subscribe((res) => (this.summary = res));
  }

  onLoanCreated() {
    this.refreshData(); // Refresh summary
    if (this.routeList) this.routeList.loadRoute(); // Refresh route list
  }
}
