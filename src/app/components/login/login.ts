import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';
import { LucideAngularModule, User, Lock, AlertCircle } from 'lucide-angular';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule, RouterModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class Login {
  readonly User = User;
  readonly Lock = Lock;
  readonly AlertCircle = AlertCircle;
  login: string = '';
  password: string = '';
  error: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    this.authService.login(this.login, this.password).subscribe({
      next: (res) => {
        this.authService.saveTokens(res);
        this.error = '';
        this.router.navigate(['/pokedex']);
      },
      error: (err) => {
        console.error(err);
        this.error = 'Login ou senha inválidos.';
      },
    });
  }
}
