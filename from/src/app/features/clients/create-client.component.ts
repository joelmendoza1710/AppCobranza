import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClientService } from '../../core/services/client.service';

@Component({
  selector: 'app-create-client',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    >
      <div
        class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6"
      >
        <h2 class="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
          Nuevo Cliente
        </h2>

        <form (ngSubmit)="onSubmit()" class="space-y-4">
          <div>
            <label
              class="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >Nombre Completo</label
            >
            <input
              type="text"
              [(ngModel)]="name"
              name="name"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white p-2"
              required
            />
          </div>

          <div>
            <label
              class="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >DNI / Cédula</label
            >
            <input
              type="text"
              [(ngModel)]="dni"
              name="dni"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white p-2"
              required
            />
          </div>

          <div>
            <label
              class="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >Dirección</label
            >
            <input
              type="text"
              [(ngModel)]="address"
              name="address"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white p-2"
            />
          </div>

          <div>
            <label
              class="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >Teléfono</label
            >
            <input
              type="text"
              [(ngModel)]="phone"
              name="phone"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white p-2"
            />
          </div>

          <div class="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              (click)="onClose.emit()"
              class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
            >
              Cancelar
            </button>
            <button
              type="submit"
              class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Guardar Cliente
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
})
export class CreateClientComponent {
  @Output() onClose = new EventEmitter<void>();
  @Output() onCreated = new EventEmitter<void>();

  name = '';
  dni = '';
  address = '';
  phone = '';

  constructor(private clientService: ClientService) {}

  onSubmit() {
    const clientData = {
      name: this.name,
      dni: this.dni,
      address: this.address,
      phone: this.phone,
    };

    this.clientService.createClient(clientData).subscribe({
      next: () => {
        alert('Cliente creado exitosamente');
        this.onCreated.emit();
        this.onClose.emit();
      },
      error: (err) => alert('Error al crear cliente'),
    });
  }
}
