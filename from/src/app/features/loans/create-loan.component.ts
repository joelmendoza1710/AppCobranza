import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoanService } from '../../core/services/loan.service';
import { ClientService } from '../../core/services/client.service';
import { Client } from '../../core/models/api.models';

@Component({
  selector: 'app-create-loan',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    >
      <div
        class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-lg w-full p-6"
      >
        <h2 class="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
          Nuevo Préstamo
        </h2>

        <form (ngSubmit)="onSubmit()" class="space-y-4">
          <!-- Client Select -->
          <div>
            <label
              class="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >Cliente</label
            >
            <select
              [(ngModel)]="clientId"
              name="clientId"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white p-2"
              required
            >
              <option *ngFor="let client of clients" [value]="client.id">
                {{ client.name }}
              </option>
            </select>
          </div>

          <!-- Amount -->
          <div>
            <label
              class="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >Monto ($)</label
            >
            <input
              type="number"
              [(ngModel)]="amount"
              (ngModelChange)="calculate()"
              name="amount"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white p-2"
              required
            />
          </div>

          <!-- Interest & Installments -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label
                class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >Interés (%)</label
              >
              <input
                type="number"
                [(ngModel)]="interestPercentage"
                (ngModelChange)="calculate()"
                name="interestPercentage"
                placeholder="20"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white p-2"
                required
              />
            </div>
            <div>
              <label
                class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >Cuotas</label
              >
              <input
                type="number"
                [(ngModel)]="installments"
                (ngModelChange)="calculate()"
                name="installments"
                [placeholder]="frequency === 'DAILY' ? 'Días' : 'Semanas'"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white p-2"
                required
              />
            </div>
          </div>

          <!-- Frequency -->
          <div>
            <label
              class="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >Frecuencia</label
            >
            <select
              [(ngModel)]="frequency"
              (ngModelChange)="calculate()"
              name="frequency"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white p-2"
            >
              <option value="DAILY">Diario</option>
              <option value="WEEKLY">Semanal</option>
            </select>
          </div>

          <!-- Live Preview Card -->
          <div
            class="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg border border-blue-100 dark:border-blue-800"
          >
            <h3
              class="text-sm font-semibold text-blue-800 dark:text-blue-300 mb-2"
            >
              Pre-visualización de Pago
            </h3>
            <div class="text-2xl font-bold text-gray-900 dark:text-white">
              {{ previewInstallment | currency }}
              <span
                class="text-sm font-normal text-gray-500 dark:text-gray-400"
              >
                / {{ frequency === 'DAILY' ? 'día' : 'semana' }}
              </span>
            </div>
            <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Total a pagar:
              <span class="font-medium">{{ previewTotal | currency }}</span> por
              {{ installments }} cuotas.
            </p>
          </div>

          <!-- Actions -->
          <div class="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              (click)="onClose.emit()"
              class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
            >
              Cancelar
            </button>
            <button
              type="submit"
              class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Crear Préstamo
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
})
export class CreateLoanComponent implements OnInit {
  @Output() onClose = new EventEmitter<void>();
  @Output() onCreated = new EventEmitter<void>();

  clients: Client[] = [];

  // Form Fields
  clientId: number | null = null;
  amount: number = 0;
  interestPercentage: number = 20;
  frequency: 'DAILY' | 'WEEKLY' = 'DAILY';
  installments: number = 20;

  // Computed
  previewTotal: number = 0;
  previewInstallment: number = 0;

  constructor(
    private loanService: LoanService,
    private clientService: ClientService // Assuming we have this, or need to verify
  ) {}

  ngOnInit() {
    this.loadClients();
    this.calculate();
  }

  loadClients() {
    this.clientService.getClients().subscribe({
      next: (data: Client[]) => (this.clients = data),
      error: (err: any) => console.error('Failed to load clients', err),
    });
  }

  calculate() {
    if (!this.amount || !this.interestPercentage || !this.installments) {
      this.previewTotal = 0;
      this.previewInstallment = 0;
      return;
    }

    const interestFactor = this.interestPercentage / 100;
    this.previewTotal = this.amount * (1 + interestFactor);
    this.previewInstallment = this.previewTotal / this.installments;
  }

  onSubmit() {
    if (!this.clientId) {
      alert('Por favor selecciona un cliente');
      return;
    }

    const loanData = {
      clientId: this.clientId,
      amount: this.amount,
      interestPercentage: this.interestPercentage,
      paymentFrequency: this.frequency,
      installments: this.installments,
    };

    // Need to update LoanService to accept this payload
    this.loanService.createLoan(loanData).subscribe({
      next: () => {
        alert('Préstamos creado exitosamente!');
        this.onCreated.emit();
        this.onClose.emit();
      },
      error: (err) =>
        alert(
          'Error creando préstamo: ' +
            (err.error?.message || 'Error desconocido')
        ),
    });
  }
}
