import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User } from '../../services/admin';

@Component({
  selector: 'app-delete-user-modal',
  imports: [CommonModule],
  templateUrl: './delete-user.html',
  styleUrl: './delete-user.css',
})
export class DeleteUserModalComponent {
  @Input() isOpen = false;
  @Input() user: User | null = null;
  @Input() isLoading = false;
  @Output() close = new EventEmitter<void>();
  @Output() confirm = new EventEmitter<void>();

  onConfirm() {
    this.confirm.emit();
  }

  onClose() {
    this.close.emit();
  }
}
