import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface User {
  id_usuario: number;
  nome: string;
  login: string;
  email: string;
  dt_inclusao?: string;
  is_active?: boolean;
  is_staff?: boolean;
}

export interface UserListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: User[];
}

export interface PasswordChangeRequest {
  old_password: string;
  new_password: string;
}

export interface PasswordResetRequest {
  new_password: string;
}

export interface ApiResponse {
  message?: string;
  user?: User;
  error?: string;
}

@Injectable({
  providedIn: 'root',
})
export class Admin {
  private baseUrl = 'http://localhost:8000/api/auth';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('access_token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

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
    } else if (error.status === 401) {
      errorMessage = 'Não autorizado. Faça login novamente.';
    } else if (error.status === 403) {
      errorMessage = 'Acesso negado. Você não tem permissão para esta ação.';
    } else if (error.status === 404) {
      errorMessage = 'Recurso não encontrado.';
    } else {
      errorMessage = `Erro ${error.status}: ${error.statusText || 'Erro no servidor'}`;
    }

    return throwError(() => new Error(errorMessage));
  }

  // Listar usuários (Admin)
  listUsers(search?: string, ordering?: string): Observable<User[]> {
    let url = `${this.baseUrl}/admin/users/`;
    const params: string[] = [];

    if (search) {
      params.push(`search=${encodeURIComponent(search)}`);
    }
    if (ordering) {
      params.push(`ordering=${ordering}`);
    }

    if (params.length > 0) {
      url += '?' + params.join('&');
    }

    return this.http
      .get<User[]>(url, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  getUser(userId: number): Observable<User> {
    return this.http
      .get<User>(`${this.baseUrl}/admin/users/${userId}/`, {
        headers: this.getHeaders(),
      })
      .pipe(catchError(this.handleError));
  }

  updateUser(userId: number, userData: Partial<User>): Observable<User> {
    return this.http
      .patch<User>(`${this.baseUrl}/admin/users/${userId}/`, userData, {
        headers: this.getHeaders(),
      })
      .pipe(catchError(this.handleError));
  }

  deleteUser(userId: number): Observable<void> {
    return this.http
      .delete<void>(`${this.baseUrl}/admin/users/${userId}/`, {
        headers: this.getHeaders(),
      })
      .pipe(catchError(this.handleError));
  }

  adminResetPassword(userId: number, newPassword: string): Observable<ApiResponse> {
    return this.http
      .post<ApiResponse>(
        `${this.baseUrl}/admin/users/${userId}/reset-password/`,
        { new_password: newPassword },
        { headers: this.getHeaders() }
      )
      .pipe(catchError(this.handleError));
  }

  changePassword(oldPassword: string, newPassword: string): Observable<ApiResponse> {
    return this.http
      .post<ApiResponse>(
        `${this.baseUrl}/change-password/`,
        { old_password: oldPassword, new_password: newPassword },
        { headers: this.getHeaders() }
      )
      .pipe(catchError(this.handleError));
  }

  getProfile(): Observable<User> {
    return this.http
      .get<User>(`${this.baseUrl}/profile/`, {
        headers: this.getHeaders(),
      })
      .pipe(catchError(this.handleError));
  }

  updateProfile(userData: Partial<User>): Observable<ApiResponse> {
    return this.http
      .patch<ApiResponse>(`${this.baseUrl}/profile/`, userData, {
        headers: this.getHeaders(),
      })
      .pipe(catchError(this.handleError));
  }
}
