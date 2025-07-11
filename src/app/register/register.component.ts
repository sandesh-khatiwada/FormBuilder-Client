import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  username: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  errorMessages: string[] = [];

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    this.errorMessages = [];

    if (this.password !== this.confirmPassword) {
      this.errorMessages.push('Password and Confirm Password do not match.');
      return;
    }

    this.authService.register(this.email, this.password, this.username).subscribe({
      next: () => {
        // Navigation handled by AuthService
      },
      error: (err) => {
        console.error('Registration failed', err);
        if (err.error && err.error.errors) {
          this.errorMessages = err.error.errors;
        } else {
          this.errorMessages = ['An unexpected error occurred. Please try again.'];
        }
      }
    });
  }
}
