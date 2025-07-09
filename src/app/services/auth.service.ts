
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

interface LoginResponse {
  success: boolean;
  status: string;
  message: string;
  data: {
    email: string;
    token: string;
    roles: string[];
  };
  errors: any;
  timestamp: string;
}

interface RegisterResponse {
  success: boolean;
  status: string;
  message: string;
  data: {
    username: string;
    email: string;
    role: string;
  };
  errors: any;
  timestamp: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8090/api';
  private token: string | null = null;
  private roles: string[] = [];

  constructor(private http: HttpClient, private router: Router) {}

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/login`, { email, password })
      .pipe(
        tap(response => {
          if (response.success) {
            this.token = response.data.token;
            this.roles = response.data.roles;
            localStorage.setItem('token', this.token);
            localStorage.setItem('roles', JSON.stringify(this.roles));
            this.navigateBasedOnRole();
          }
        })
      );
  }

  register(email: string, password: string, username: string): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${this.apiUrl}/auth/register`, {
      email,
      password,
      role: 'USER',
      username
    }).pipe(
      tap(response => {
        if (response.success) {
          this.router.navigate(['/login']);
        }
      })
    );
  }

  getToken(): string | null {
    return this.token || localStorage.getItem('token');
  }

  getRoles(): string[] {
    return this.roles.length > 0 ? this.roles : JSON.parse(localStorage.getItem('roles') || '[]');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    this.token = null;
    this.roles = [];
    localStorage.removeItem('token');
    localStorage.removeItem('roles');
    this.router.navigate(['/login']);
  }

  private navigateBasedOnRole(): void {
    const roles = this.getRoles();
    if (roles.includes('ADMIN')) {
      this.router.navigate(['/admin-dashboard']);
    } else if (roles.includes('USER')) {
      this.router.navigate(['/user-dashboard']);
    }
  }
}
