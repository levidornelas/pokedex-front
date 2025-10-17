import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth';
import { RouterModule } from '@angular/router';
import { LucideAngularModule, User, Mail, Lock, AlertCircle } from 'lucide-angular';

@Component({
  selector: 'app-cadastro',
  imports: [CommonModule, FormsModule, LucideAngularModule, RouterModule],
  templateUrl: './cadastro.html',
  styleUrl: './cadastro.css',
  standalone: true,
})
export class Cadastro {
  nome: string = '';
  login: string = '';
  email: string = '';
  password: string = '';
  password2: string = '';

  error: string | null = null;
  isLoading: boolean = false;
  backendErrors: any | null = null;
  localErrors: any = {};

  protected readonly User = User;
  protected readonly Mail = Mail;
  protected readonly Lock = Lock;
  protected readonly AlertCircle = AlertCircle;

  constructor(private authService: AuthService, private router: Router) {}

  validateFields(): boolean {
    this.localErrors = {};
    let isValid = true;

    if (!this.nome.trim()) {
      this.localErrors.nome = ['O nome completo é obrigatório'];
      isValid = false;
    }

    if (!this.login.trim()) {
      this.localErrors.login = ['O login é obrigatório'];
      isValid = false;
    }

    if (!this.email.trim()) {
      this.localErrors.email = ['O email é obrigatório'];
      isValid = false;
    } else if (!this.isValidEmail(this.email)) {
      this.localErrors.email = ['Digite um email válido'];
      isValid = false;
    }

    if (!this.password) {
      this.localErrors.password = ['A senha é obrigatória'];
      isValid = false;
    } else if (this.password.length < 6) {
      this.localErrors.password = ['A senha deve ter pelo menos 6 caracteres'];
      isValid = false;
    }

    if (!this.password2) {
      this.localErrors.password2 = ['Confirme sua senha'];
      isValid = false;
    } else if (this.password !== this.password2) {
      this.localErrors.password2 = ['As senhas não coincidem'];
      isValid = false;
    }

    return isValid;
  }

  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  getFieldError(field: string): string[] | null {
    return this.localErrors[field] || this.backendErrors?.[field] || null;
  }

  onSubmit(): void {
    this.error = null;
    this.backendErrors = null;

    // Valida campos localmente
    if (!this.validateFields()) {
      return;
    }

    this.isLoading = true;

    this.authService
      .cadastro(this.nome, this.login, this.email, this.password, this.password2)
      .subscribe({
        next: (response) => {
          if ('access' in response) {
            console.log(response);
            this.authService.saveTokens(response);
          }

          this.router.navigate(['/pokedex']);
        },
        error: (err: Error) => {
          this.error = err.message;
          this.isLoading = false;
        },
        complete: () => {
          this.isLoading = false;
        },
      });
  }
}
