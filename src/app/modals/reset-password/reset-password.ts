import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { User } from '../../services/admin';

@Component({
  selector: 'app-reset-password-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reset-password.html',
})
export class ResetPasswordModalComponent {
  @Input() isOpen = false;
  @Input() user: User | null = null;
  @Input() isLoading = false;
  @Input() errorMessage = '';
  @Output() close = new EventEmitter<void>();
  @Output() reset = new EventEmitter<{ password: string; confirm: string }>();

  newPassword = '';
  confirmPassword = '';

  onReset() {
    this.reset.emit({ password: this.newPassword, confirm: this.confirmPassword });
  }

  onClose() {
    this.close.emit();
  }
}
