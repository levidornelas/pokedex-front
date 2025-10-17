import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

interface AuthResponse {
  access: string;
  refresh: string;
}

interface CadastroSucesso {
  mensagem: string;
  login: string;
  email: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = 'http://localhost:8000/api/auth';

  constructor(private http: HttpClient) {}

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Um erro desconhecido ocorreu.';

    if (error.error instanceof ErrorEvent) {
      errorMessage = `Erro de rede: ${error.error.message}`;
    } else if (error.status === 400 && error.error) {
      const errors = error.error;
      if (typeof errors === 'object') {
        const firstKey = Object.keys(errors)[0];
        if (firstKey && errors[firstKey]) {
          errorMessage = Array.isArray(errors[firstKey]) ? errors[firstKey][0] : errors[firstKey];
        }
      } else if (typeof errors === 'string') {
        errorMessage = errors;
      }
    } else {
      errorMessage = `Erro ${error.status}: ${error.statusText || 'Erro no servidor'}`;
    }

    return throwError(() => new Error(errorMessage));
  }

  login(login: string, password: string): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.baseUrl}/login/`, {
        login,
        password,
      })
      .pipe(catchError(this.handleError));
  }

  cadastro(
    nome: string,
    login: string,
    email: string,
    password: string,
    password2: string
  ): Observable<CadastroSucesso | AuthResponse> {
    return this.http
      .post<CadastroSucesso | AuthResponse>(`${this.baseUrl}/register/`, {
        nome,
        login,
        email,
        password,
        password2,
      })
      .pipe(catchError(this.handleError));
  }

  saveTokens(tokens: AuthResponse) {
    localStorage.setItem('access_token', tokens.access);
    localStorage.setItem('refresh_token', tokens.refresh);
  }

  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }

  getAccessToken(): string | null {
    return localStorage.getItem('access_token');
  }
}
