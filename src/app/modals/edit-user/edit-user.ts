import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { User } from '../../services/admin';

@Component({
  selector: 'app-edit-user-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-user.html',
})
export class EditUserModalComponent {
  @Input() isOpen = false;
  @Input() user: Partial<User> = {};
  @Input() isLoading = false;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<Partial<User>>();

  onSave() {
    this.save.emit(this.user);
  }

  onClose() {
    this.close.emit();
  }
}
