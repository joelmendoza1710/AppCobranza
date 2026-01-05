import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div
      class="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900"
    >
      <div
        class="max-w-md w-full mx-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8"
      >
        <h2
          class="text-3xl font-bold text-center text-gray-800 dark:text-white mb-6"
        >
          Bienvenido
        </h2>
        <form (ngSubmit)="onSubmit()">
          <div class="mb-4">
            <label
              class="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2"
              >Username</label
            >
            <input
              [(ngModel)]="username"
              name="username"
              type="text"
              class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
              required
            />
          </div>
          <div class="mb-6">
            <label
              class="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2"
              >Password</label
            >
            <input
              [(ngModel)]="password"
              name="password"
              type="password"
              class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
              required
            />
          </div>
          <button
            type="submit"
            class="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  `,
})
export class LoginComponent {
  username = '';
  password = '';

  constructor(private auth: AuthService, private router: Router) {}

  onSubmit() {
    this.auth
      .login({ username: this.username, password: this.password })
      .subscribe({
        next: () => this.router.navigate(['/dashboard']),
        error: (err) => alert('Login failed'),
      });
  }
}
