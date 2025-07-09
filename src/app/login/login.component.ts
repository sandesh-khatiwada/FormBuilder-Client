
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessages: string[] = [];

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    this.errorMessages = []; 
    this.authService.login(this.email, this.password).subscribe({
      next: () => {
        // Navigation is handled by AuthService itself
      },
      error: (err) => {
        console.error('Login failed', err);
        if (err.error && err.error.errors) {
          this.errorMessages = err.error.errors;
        } else {
          this.errorMessages = ['An unexpected error occurred. Please try again.'];
        }
      }
    });
  }
}
