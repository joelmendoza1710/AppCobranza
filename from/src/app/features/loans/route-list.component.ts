import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouteService } from '../../core/services/route.service';
import { RouteDTO } from '../../core/models/api.models';
// Import LoanService to handle payments if needed, or RouteService handles it.
// For this MVP, we might need a way to register payment from here.
// Let's reuse the logic from Dashboard or create a specialized one.
import { LoanService } from '../../core/services/loan.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-route-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6">
      <h2 class="text-xl font-bold text-gray-800 dark:text-white hidden">
        Mi Ruta de Hoy
      </h2>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div
          *ngFor="let item of paginatedRoute"
          class="group relative overflow-hidden rounded-2xl p-5 transition-all duration-300 hover:shadow-xl border"
          [ngClass]="{
            'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700':
              item.statusToday === 'PENDING',
            'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800':
              item.statusToday === 'PAID',
            'bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 opacity-60':
              item.statusToday === 'SKIPPED'
          }"
        >
          <!-- Status Indicator Line -->
          <div
            class="absolute left-0 top-0 bottom-0 w-1.5 transition-colors duration-300"
            [ngClass]="{
              'bg-blue-600': item.statusToday === 'PENDING',
              'bg-emerald-500': item.statusToday === 'PAID',
              'bg-gray-400': item.statusToday === 'SKIPPED'
            }"
          ></div>

          <div class="pl-3">
            <div class="flex justify-between items-start mb-2">
              <div>
                <span
                  class="inline-block text-[10px] font-bold uppercase tracking-wider py-0.5 px-2 rounded-full mb-1"
                  [ngClass]="{
                    'bg-blue-100 text-blue-800': item.statusToday === 'PENDING',
                    'bg-emerald-100 text-emerald-700':
                      item.statusToday === 'PAID',
                    'bg-gray-200 text-gray-700': item.statusToday === 'SKIPPED'
                  }"
                >
                  {{
                    item.statusToday === 'PENDING'
                      ? 'PENDIENTE'
                      : item.statusToday === 'PAID'
                      ? 'PAGADO'
                      : 'NO ABONÓ'
                  }}
                </span>
                <h3
                  class="font-bold text-lg text-gray-900 dark:text-white leading-tight group-hover:text-blue-700 transition-colors"
                >
                  {{ item.clientName }}
                </h3>
              </div>
              <div
                class="text-xs font-bold bg-white dark:bg-gray-700 text-gray-600 px-2 py-1 rounded-lg border border-gray-100 dark:border-gray-600"
              >
                #{{ item.routeOrder }}
              </div>
            </div>

            <p
              class="text-xs text-gray-600 dark:text-gray-400 mb-3 flex items-center"
            >
              <svg
                class="w-3 h-3 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                ></path>
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                ></path>
              </svg>
              {{ item.address }}
            </p>

            <div
              class="flex justify-between items-center bg-white dark:bg-gray-700/50 p-2 rounded-lg mb-3 border border-gray-100 dark:border-gray-700"
            >
              <div class="text-center">
                <span class="text-[10px] text-gray-500 uppercase font-semibold"
                  >Cuota</span
                >
                <p class="font-bold text-gray-800 dark:text-gray-200">
                  {{ item.installmentAmount | currency }}
                </p>
              </div>
              <div class="h-6 w-px bg-gray-200 dark:bg-gray-600"></div>
              <div class="text-center">
                <span class="text-[10px] text-gray-500 uppercase font-semibold"
                  >Saldo</span
                >
                <p class="font-bold text-rose-600">
                  {{ item.remainingBalance | currency }}
                </p>
              </div>
            </div>

            <!-- Actions -->
            <div *ngIf="item.statusToday === 'PENDING'" class="flex gap-2 mt-4">
              <button
                (click)="openPayment(item)"
                class="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-2 rounded-xl text-sm font-bold shadow hover:shadow-lg hover:-translate-y-0.5 transition-all"
              >
                Cobrar
              </button>
              <button
                (click)="markSkipped(item)"
                class="px-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-300 transition-colors"
              >
                <svg
                  class="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              </button>
            </div>

            <div
              *ngIf="item.statusToday === 'PAID'"
              class="bg-emerald-50 dark:bg-emerald-900/30 p-2 rounded-lg text-emerald-700 dark:text-emerald-300 text-center text-sm font-bold border border-emerald-100 dark:border-emerald-800"
            >
              ✅ Abonó: {{ item.paidTodayAmount | currency }}
            </div>

            <div
              *ngIf="item.statusToday === 'SKIPPED'"
              class="text-center text-sm font-medium text-gray-400 italic py-2"
            >
              Visitado (Sin abono)
            </div>
          </div>
        </div>
      </div>

      <div
        *ngIf="route.length === 0"
        class="flex flex-col items-center justify-center p-12 bg-white dark:bg-gray-800 rounded-2xl border-2 border-dashed border-gray-200"
      >
        <div
          class="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-4 text-2xl"
        >
          📍
        </div>
        <p class="text-gray-500 font-medium">No hay clientes hoy</p>
      </div>

      <!-- Pagination Controls -->
      <div
        *ngIf="route.length > pageSize"
        class="flex justify-between items-center bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700"
      >
        <button
          (click)="currentPage = currentPage - 1"
          [disabled]="currentPage === 1"
          class="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Anterior
        </button>
        <span class="text-sm font-bold text-gray-600 dark:text-gray-400">
          Página {{ currentPage }} de {{ numberOfPages }}
        </span>
        <button
          (click)="currentPage = currentPage + 1"
          [disabled]="currentPage === numberOfPages"
          class="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Siguiente
        </button>
      </div>

      <!-- Payment Modal -->
      <div
        *ngIf="selectedItem"
        class="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center p-4 z-50"
      >
        <div
          class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-sm w-full p-6 animate-fade-in-up"
        >
          <div class="text-center mb-6">
            <div
              class="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3"
            >
              <svg
                class="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
            </div>
            <h3 class="text-xl font-bold dark:text-white">Registrar Abono</h3>
            <p class="text-gray-500 dark:text-gray-400 text-sm mt-1">
              {{ selectedItem.clientName }}
            </p>
          </div>

          <div class="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl mb-6">
            <div class="flex justify-between text-sm mb-2">
              <span class="text-gray-500">Cuota Sugerida:</span>
              <span class="font-bold text-gray-800 dark:text-white">{{
                selectedItem.installmentAmount | currency
              }}</span>
            </div>
            <input
              [(ngModel)]="paymentAmount"
              type="number"
              class="w-full bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 rounded-xl p-3 text-2xl font-bold text-center focus:border-emerald-500 focus:ring-0 outline-none transition-colors"
              placeholder="0.00"
              autofocus
            />
          </div>

          <div class="flex space-x-3">
            <button
              (click)="selectedItem = null"
              class="flex-1 py-3 text-gray-600 font-medium hover:bg-gray-100 rounded-xl transition-colors"
            >
              Cancelar
            </button>
            <button
              (click)="confirmPayment()"
              class="flex-1 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/30 transition-all"
            >
              Confirmar
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class RouteListComponent implements OnInit {
  @Output() routeUpdated = new EventEmitter<void>();
  route: RouteDTO[] = [];
  selectedItem: RouteDTO | null = null;
  paymentAmount: number = 0;

  // Pagination
  currentPage: number = 1;
  pageSize: number = 6;

  constructor(
    private routeService: RouteService,
    private loanService: LoanService
  ) {}

  ngOnInit() {
    this.loadRoute();
  }

  get paginatedRoute() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.route.slice(startIndex, startIndex + this.pageSize);
  }

  get numberOfPages() {
    return Math.ceil(this.route.length / this.pageSize);
  }

  loadRoute() {
    this.routeService.getMyRoute().subscribe((data) => {
      this.route = data;
      // Reset to first page on reload? or keep page?
      // this.currentPage = 1;
    });
  }

  openPayment(item: RouteDTO) {
    this.selectedItem = item;
    this.paymentAmount = item.installmentAmount;
  }

  confirmPayment() {
    if (!this.selectedItem) return;

    this.loanService
      .registerPayment({
        loanId: this.selectedItem.loanId,
        amount: this.paymentAmount,
      })
      .subscribe({
        next: () => {
          this.selectedItem = null;
          this.loadRoute();
          this.routeUpdated.emit();
        },
        error: (err) => alert('Error registrando pago'),
      });
  }

  markSkipped(item: RouteDTO) {
    this.loanService
      .registerPayment({
        loanId: item.loanId,
        amount: 0,
      })
      .subscribe({
        next: () => {
          item.statusToday = 'SKIPPED';
          this.loadRoute();
          this.routeUpdated.emit();
        },
        error: (err) => alert('Error marcando visita'),
      });
  }
}
