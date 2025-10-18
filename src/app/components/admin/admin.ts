import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { User, Admin } from '../../services/admin';
import { EditUserModalComponent } from '../../modals/edit-user/edit-user';
import { ResetPasswordModalComponent } from '../../modals/reset-password/reset-password';
import { DeleteUserModalComponent } from '../../modals/delete-user/delete-user';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    EditUserModalComponent,
    ResetPasswordModalComponent,
    DeleteUserModalComponent,
  ],
  templateUrl: './admin.html',
  styleUrls: ['./admin.css'],
})
export class AdminComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  searchTerm: string = '';
  orderBy: string = '-dt_inclusao';
  isLoading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  showResetModal: boolean = false;
  selectedUser: User | null = null;
  newPassword: string = '';
  confirmPassword: string = '';
  resetPasswordError: string = '';

  showEditModal: boolean = false;
  editUser: Partial<User> = {};

  showDeleteModal: boolean = false;
  userToDelete: User | null = null;

  constructor(private userService: Admin) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.userService.listUsers(this.searchTerm, this.orderBy).subscribe({
      next: (users) => {
        this.users = users;
        this.filteredUsers = users;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = error.message;
        this.isLoading = false;
      },
    });
  }

  onSearch(): void {
    this.loadUsers();
  }

  openResetPasswordModal(user: User): void {
    this.selectedUser = user;
    this.newPassword = '';
    this.confirmPassword = '';
    this.resetPasswordError = '';
    this.showResetModal = true;
  }

  closeResetModal(): void {
    this.showResetModal = false;
    this.selectedUser = null;
    this.newPassword = '';
    this.confirmPassword = '';
    this.resetPasswordError = '';
  }

  resetPassword(): void {
    if (!this.selectedUser) return;

    // Validações
    if (!this.newPassword || this.newPassword.length < 6) {
      this.resetPasswordError = 'A senha deve ter no mínimo 6 caracteres.';
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.resetPasswordError = 'As senhas não coincidem.';
      return;
    }

    this.isLoading = true;
    this.resetPasswordError = '';

    this.userService.adminResetPassword(this.selectedUser.id_usuario, this.newPassword).subscribe({
      next: (response) => {
        this.successMessage = `Senha do usuário ${this.selectedUser?.nome} resetada com sucesso!`;
        this.closeResetModal();
        this.isLoading = false;
        setTimeout(() => (this.successMessage = ''), 5000);
      },
      error: (error) => {
        this.resetPasswordError = error.message;
        this.isLoading = false;
      },
    });
  }

  openEditModal(user: User): void {
    this.selectedUser = user;
    this.editUser = {
      nome: user.nome,
      email: user.email,
      is_active: user.is_active,
    };
    this.showEditModal = true;
  }

  closeEditModal(): void {
    this.showEditModal = false;
    this.selectedUser = null;
    this.editUser = {};
  }

  saveUser(): void {
    if (!this.selectedUser) return;

    this.isLoading = true;
    this.errorMessage = '';

    this.userService.updateUser(this.selectedUser.id_usuario, this.editUser).subscribe({
      next: (updatedUser) => {
        this.successMessage = 'Usuário atualizado com sucesso!';
        this.loadUsers();
        this.closeEditModal();
        this.isLoading = false;
        setTimeout(() => (this.successMessage = ''), 5000);
      },
      error: (error) => {
        this.errorMessage = error.message;
        this.isLoading = false;
      },
    });
  }

  openDeleteModal(user: User): void {
    this.userToDelete = user;
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.userToDelete = null;
  }

  confirmDelete(): void {
    if (!this.userToDelete) return;

    this.isLoading = true;
    this.errorMessage = '';

    this.userService.deleteUser(this.userToDelete.id_usuario).subscribe({
      next: () => {
        this.successMessage = `Usuário ${this.userToDelete?.nome} deletado com sucesso!`;
        this.loadUsers();
        this.closeDeleteModal();
        this.isLoading = false;
        setTimeout(() => (this.successMessage = ''), 5000);
      },
      error: (error) => {
        this.errorMessage = error.message;
        this.isLoading = false;
        this.closeDeleteModal();
      },
    });
  }

  formatDate(dateString?: string): string {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
}
