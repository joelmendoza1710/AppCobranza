import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../services/notification.service';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-snackbar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="snackbar-container">
      @for (notification of notificationService.notifications(); track
      notification.id) {
      <div
        class="snackbar"
        [ngClass]="notification.type"
        @slideIn
        (click)="notificationService.remove(notification.id)"
      >
        <span class="icon">
          @if(notification.type === 'success') { ✓ } @else if(notification.type
          === 'error') { ⚠ } @else { ℹ }
        </span>
        <span class="message">{{ notification.message }}</span>
        <span class="close">×</span>
      </div>
      }
    </div>
  `,
  styles: [
    `
      .snackbar-container {
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 9999;
        display: flex;
        flex-direction: column;
        gap: 10px;
        pointer-events: none; /* Allow clicking through container */
      }

      .snackbar {
        pointer-events: auto;
        min-width: 300px;
        max-width: 450px;
        padding: 12px 16px;
        border-radius: 8px;
        background: white;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
          0 2px 4px -1px rgba(0, 0, 0, 0.06);
        display: flex;
        align-items: center;
        gap: 12px;
        cursor: pointer;
        font-size: 0.95rem;
        border-left: 4px solid #ccc;

        &.success {
          border-left-color: #10b981;
          background: #ecfdf5;
          color: #065f46;
        }

        &.error {
          border-left-color: #ef4444;
          background: #fef2f2;
          color: #991b1b;
        }

        &.info {
          border-left-color: #3b82f6;
          background: #eff6ff;
          color: #1e40af;
        }

        .icon {
          font-weight: bold;
          font-size: 1.2rem;
        }

        .message {
          flex: 1;
        }

        .close {
          opacity: 0.5;
          font-size: 1.2rem;
          &:hover {
            opacity: 1;
          }
        }
      }
    `,
  ],
  animations: [
    trigger('slideIn', [
      transition(':enter', [
        style({ transform: 'translateX(100%)', opacity: 0 }),
        animate(
          '300ms cubic-bezier(0.4, 0, 0.2, 1)',
          style({ transform: 'translateX(0)', opacity: 1 })
        ),
      ]),
      transition(':leave', [
        animate(
          '200ms cubic-bezier(0.4, 0, 0.2, 1)',
          style({ transform: 'translateX(100%)', opacity: 0 })
        ),
      ]),
    ]),
  ],
})
export class SnackbarComponent {
  notificationService = inject(NotificationService);
}
