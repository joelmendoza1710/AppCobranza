import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoanService } from '../../core/services/loan.service';
import { Loan } from '../../core/models/api.models';
import { FormsModule } from '@angular/forms';
import { CurrencyPipe, DatePipe } from '@angular/common';

@Component({
  selector: 'app-loan-list',
  standalone: true,
  imports: [CommonModule, FormsModule, CurrencyPipe, DatePipe],
  template: `
    <div class="space-y-6">
      <div class="flex justify-between items-center">
        <h2 class="text-2xl font-bold text-gray-800 dark:text-white">
          Mis Préstamos
        </h2>
        <!-- Future: Add create button here if needed, or filter options -->
      </div>

      <!-- Loans Table -->
      <div
        class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700"
      >
        <div class="overflow-x-auto">
          <table class="w-full text-left">
            <thead
              class="bg-gray-50 dark:bg-gray-900 border-b border-gray-100 dark:border-gray-700"
            >
              <tr>
                <th
                  class="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider"
                >
                  Cliente
                </th>
                <th
                  class="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider"
                >
                  Monto
                </th>
                <th
                  class="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider"
                >
                  Interés
                </th>
                <th
                  class="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider"
                >
                  Cuota
                </th>
                <th
                  class="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider"
                >
                  Frecuencia
                </th>
                <th
                  class="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider"
                >
                  Inicio
                </th>
                <th
                  class="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider"
                >
                  Fin
                </th>
                <th
                  class="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider"
                >
                  Saldo
                </th>
                <th
                  class="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider"
                >
                  Estado
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 dark:divide-gray-700">
              <tr
                *ngFor="let loan of loans"
                class="hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-colors"
              >
                <td class="px-6 py-4 font-bold text-gray-800 dark:text-white">
                  {{ loan.client.name }}
                </td>
                <td class="px-6 py-4 font-medium">
                  {{ loan.amount | currency }}
                </td>
                <td class="px-6 py-4 text-gray-500">
                  {{ loan.interestPercentage }}%
                </td>
                <td class="px-6 py-4 font-medium">
                  {{ loan.installmentAmount | currency }}
                </td>
                <td class="px-6 py-4">
                  <span
                    class="px-2.5 py-1 rounded-lg text-xs font-bold"
                    [ngClass]="{
                      'bg-indigo-100 text-indigo-700':
                        loan.paymentFrequency === 'DAILY',
                      'bg-purple-100 text-purple-700':
                        loan.paymentFrequency === 'WEEKLY'
                    }"
                  >
                    {{
                      loan.paymentFrequency === 'DAILY' ? 'DIARIO' : 'SEMANAL'
                    }}
                  </span>
                </td>
                <td class="px-6 py-4 text-sm text-gray-500">
                  {{ loan.startDate | date : 'dd/MM/yy' }}
                </td>
                <td class="px-6 py-4 text-sm text-gray-500">
                  {{ loan.endDate | date : 'dd/MM/yy' }}
                </td>
                <td
                  class="px-6 py-4 font-bold"
                  [class.text-rose-500]="loan.remainingBalance > 0"
                  [class.text-emerald-500]="loan.remainingBalance === 0"
                >
                  {{ loan.remainingBalance | currency }}
                </td>
                <td class="px-6 py-4">
                  <span
                    [class.bg-green-100]="loan.status === 'PAID'"
                    [class.text-green-800]="loan.status === 'PAID'"
                    [class.bg-yellow-100]="loan.status === 'ACTIVE'"
                    [class.text-yellow-800]="loan.status === 'ACTIVE'"
                    class="px-2 py-1 rounded text-xs"
                  >
                    {{ loan.status === 'ACTIVE' ? 'ACTIVO' : 'PAGADO' }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>

          <div *ngIf="loans.length === 0" class="p-8 text-center text-gray-500">
            No tienes préstamos registrados.
          </div>
        </div>
      </div>
    </div>
  `,
})
export class LoanListComponent implements OnInit {
  loans: Loan[] = [];

  constructor(private loanService: LoanService) {}

  ngOnInit() {
    this.loanService.getLoans().subscribe((data) => (this.loans = data));
  }
}
