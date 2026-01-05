import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink } from '@angular/router';
import { AuthService } from '../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  template: `
    <div class="flex h-screen bg-gray-50 dark:bg-gray-900 font-sans">
      <!-- Sidebar -->
      <aside
        class="w-64 bg-slate-900 text-white shadow-2xl hidden md:flex flex-col transition-all duration-300"
      >
        <!-- Logo Area -->
        <div class="p-6 border-b border-white/10 flex items-center space-x-3">
          <div
            class="w-8 h-8 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg"
          >
            <span class="font-bold text-white text-lg">C</span>
          </div>
          <h1 class="text-xl font-bold tracking-wide">Cobranzas</h1>
        </div>

        <!-- Navigation -->
        <nav class="flex-1 mt-6 px-4 space-y-2">
          <a
            routerLink="/dashboard"
            routerLinkActive="bg-white/10 text-white shadow-md backdrop-blur-sm border-l-4 border-blue-400"
            class="flex items-center px-4 py-3 text-gray-400 hover:bg-white/5 hover:text-white rounded-r-lg transition-all duration-200 group"
          >
            <!-- Icon Placeholder (Box) -->
            <span
              class="mr-3 opacity-70 group-hover:opacity-100 transition-opacity"
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
                  d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                ></path>
              </svg>
            </span>
            <span class="font-medium">Inicio</span>
          </a>

          <a
            routerLink="/clients"
            routerLinkActive="bg-white/10 text-white shadow-md backdrop-blur-sm border-l-4 border-purple-400"
            class="flex items-center px-4 py-3 text-gray-400 hover:bg-white/5 hover:text-white rounded-r-lg transition-all duration-200 group"
          >
            <span
              class="mr-3 opacity-70 group-hover:opacity-100 transition-opacity"
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
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                ></path>
              </svg>
            </span>
            <span class="font-medium">Clientes</span>
          </a>

          <a
            routerLink="/loans"
            routerLinkActive="bg-white/10 text-white shadow-md backdrop-blur-sm border-l-4 border-emerald-400"
            class="flex items-center px-4 py-3 text-gray-400 hover:bg-white/5 hover:text-white rounded-r-lg transition-all duration-200 group"
          >
            <span
              class="mr-3 opacity-70 group-hover:opacity-100 transition-opacity"
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
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
            </span>
            <span class="font-medium">Préstamos</span>
          </a>
        </nav>

        <!-- Footer / Logout -->
        <div class="p-4 border-t border-white/10">
          <button
            (click)="logout()"
            class="w-full flex items-center justify-center px-4 py-2 text-red-300 hover:bg-red-500/10 hover:text-red-200 rounded-lg transition-colors"
          >
            <svg
              class="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              ></path>
            </svg>
            <span class="font-medium">Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      <!-- Main Content -->
      <main
        class="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 dark:bg-gray-900"
      >
        <!-- Header Mobile (Visible only on small screens) -->
        <div
          class="md:hidden bg-slate-900 text-white p-4 flex justify-between items-center shadow-md"
        >
          <span class="font-bold">Cobranzas</span>
          <!-- Simple Menu Button Placeholder -->
          <button class="text-white">☰</button>
        </div>

        <div class="container mx-auto px-6 py-8">
          <router-outlet></router-outlet>
        </div>
      </main>
    </div>
  `,
})
export class LayoutComponent {
  constructor(private auth: AuthService, private router: Router) {}

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
