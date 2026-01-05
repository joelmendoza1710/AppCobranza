import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ExpenseService } from '../../core/services/expense.service';
import { Expense } from '../../core/models/api.models';

@Component({
  selector: 'app-expenses-widget',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div
      class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 h-full flex flex-col"
    >
      <div class="flex justify-between items-center mb-6">
        <h3
          class="text-lg font-bold text-gray-800 dark:text-white flex items-center"
        >
          <span class="text-rose-500 mr-2">📉</span> Gastos del Día
        </h3>
        <button
          (click)="showModal = true"
          class="bg-rose-100 text-rose-600 hover:bg-rose-200 w-8 h-8 rounded-full flex items-center justify-center font-bold text-xl transition-colors"
        >
          +
        </button>
      </div>

      <div class="flex-1 overflow-y-auto space-y-3 custom-scrollbar">
        <div
          *ngFor="let expense of expenses"
          class="group flex justify-between items-center p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors border border-transparent hover:border-gray-100 dark:hover:border-gray-600"
        >
          <div class="flex items-center space-x-3">
            <!-- Icon based on Category -->
            <div
              class="w-10 h-10 rounded-full flex items-center justify-center text-lg"
              [ngClass]="{
                'bg-orange-100 text-orange-600': expense.category === 'FOOD',
                'bg-blue-100 text-blue-600': expense.category === 'FUEL',
                'bg-gray-100 text-gray-600': expense.category === 'MAINTENANCE',
                'bg-purple-100 text-purple-600': expense.category === 'OTHER'
              }"
            >
              {{
                expense.category === 'FOOD'
                  ? '🍔'
                  : expense.category === 'FUEL'
                  ? '⛽'
                  : expense.category === 'MAINTENANCE'
                  ? '🔧'
                  : '📝'
              }}
            </div>
            <div>
              <p class="font-bold text-gray-800 dark:text-gray-200 text-sm">
                {{ expense.description }}
              </p>
              <p class="text-[10px] text-gray-400 font-medium">
                {{ expense.category }}
              </p>
            </div>
          </div>
          <span class="text-rose-500 font-bold"
            >-{{ expense.amount | currency }}</span
          >
        </div>

        <div
          *ngIf="expenses.length === 0"
          class="flex flex-col items-center justify-center h-32 text-gray-400"
        >
          <span class="text-4xl mb-2 opacity-30">💸</span>
          <p class="text-sm">Sin gastos hoy</p>
        </div>
      </div>

      <!-- Create Expense Modal -->
      <div
        *ngIf="showModal"
        class="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center p-4 z-50"
      >
        <div
          class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-sm w-full p-6 animate-fade-in-up"
        >
          <h3
            class="text-xl font-bold mb-6 text-gray-800 dark:text-white border-b pb-2"
          >
            Registrar Gasto
          </h3>

          <form (ngSubmit)="onSubmit()" class="space-y-4">
            <div>
              <label
                class="block text-xs font-bold text-gray-500 uppercase mb-1"
                >Descripción</label
              >
              <input
                type="text"
                [(ngModel)]="newExpense.description"
                name="description"
                class="input-field w-full border-2 border-gray-200 dark:border-gray-600 p-3 rounded-xl focus:border-rose-500 outline-none dark:bg-gray-700 dark:text-white transition-colors"
                placeholder="Ej: Almuerzo"
                required
              />
            </div>
            <div>
              <label
                class="block text-xs font-bold text-gray-500 uppercase mb-1"
                >Monto</label
              >
              <input
                type="number"
                [(ngModel)]="newExpense.amount"
                name="amount"
                class="input-field w-full border-2 border-gray-200 dark:border-gray-600 p-3 rounded-xl focus:border-rose-500 outline-none dark:bg-gray-700 dark:text-white transition-colors"
                placeholder="0.00"
                required
              />
            </div>
            <div>
              <label
                class="block text-xs font-bold text-gray-500 uppercase mb-1"
                >Categoría</label
              >
              <select
                [(ngModel)]="newExpense.category"
                name="category"
                class="input-field w-full border-2 border-gray-200 dark:border-gray-600 p-3 rounded-xl focus:border-rose-500 outline-none dark:bg-gray-700 dark:text-white transition-colors"
              >
                <option value="FOOD">🍔 Comida</option>
                <option value="FUEL">⛽ Combustible</option>
                <option value="MAINTENANCE">🔧 Mantenimiento</option>
                <option value="OTHER">📝 Otro</option>
              </select>
            </div>

            <div class="flex space-x-3 pt-4">
              <button
                type="button"
                (click)="showModal = false"
                class="flex-1 py-3 text-gray-600 font-medium hover:bg-gray-100 rounded-xl transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                class="flex-1 py-3 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-xl shadow-lg shadow-rose-500/30 transition-all"
              >
                Guardar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
})
export class ExpensesWidgetComponent implements OnInit {
  @Output() expenseAdded = new EventEmitter<void>();
  expenses: Expense[] = [];
  showModal = false;
  newExpense: Expense = { description: '', amount: 0, category: 'OTHER' };

  constructor(private expenseService: ExpenseService) {}

  ngOnInit() {
    this.loadExpenses();
  }

  loadExpenses() {
    this.expenseService
      .getTodayExpenses()
      .subscribe((data) => (this.expenses = data));
  }

  onSubmit() {
    this.expenseService.createExpense(this.newExpense).subscribe(() => {
      this.showModal = false;
      this.newExpense = { description: '', amount: 0, category: 'OTHER' };
      this.loadExpenses();
      this.expenseAdded.emit();
    });
  }
}
