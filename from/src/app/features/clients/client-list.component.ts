import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientService } from '../../core/services/client.service';
import { Client } from '../../core/models/api.models';
import { CreateClientComponent } from './create-client.component';

@Component({
  selector: 'app-client-list',
  standalone: true,
  imports: [CommonModule, CreateClientComponent],
  template: `
    <div class="space-y-6">
      <div class="flex justify-between items-center">
        <h2 class="text-2xl font-bold text-gray-800 dark:text-white">
          Clientes
        </h2>
        <button
          (click)="showCreateModal = true"
          class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Nuevo Cliente
        </button>
      </div>

      <div
        class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
      >
        <div class="overflow-x-auto">
          <table class="w-full text-left">
            <thead
              class="bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-200 uppercase text-xs"
            >
              <tr>
                <th class="px-6 py-3">Nombre</th>
                <th class="px-6 py-3">DNI</th>
                <th class="px-6 py-3">Dirección</th>
                <th class="px-6 py-3">Teléfono</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
              <tr
                *ngFor="let client of clients"
                class="hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <td class="px-6 py-4">{{ client.name }}</td>
                <td class="px-6 py-4">{{ client.dni }}</td>
                <td class="px-6 py-4">{{ client.address || '-' }}</td>
                <td class="px-6 py-4">{{ client.phone || '-' }}</td>
              </tr>
            </tbody>
          </table>
          <div
            *ngIf="clients.length === 0"
            class="p-6 text-center text-gray-500"
          >
            No hay clientes registrados.
          </div>
        </div>
      </div>

      <app-create-client
        *ngIf="showCreateModal"
        (onClose)="showCreateModal = false"
        (onCreated)="loadClients()"
      ></app-create-client>
    </div>
  `,
})
export class ClientListComponent implements OnInit {
  clients: Client[] = [];
  showCreateModal = false;

  constructor(private clientService: ClientService) {}

  ngOnInit() {
    this.loadClients();
  }

  loadClients() {
    this.clientService.getClients().subscribe({
      next: (data) => (this.clients = data),
      error: (err) => console.error('Error loading clients', err),
    });
  }
}
