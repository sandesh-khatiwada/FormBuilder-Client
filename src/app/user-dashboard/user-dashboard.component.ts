import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css']
})
export class UserDashboardComponent implements OnInit {
  formTemplates: any[] = [];
  apiUrl = 'http://localhost:8090/api';
  searchQuery: string = '';
  currentPage: number = 1;
  limit: number = 5;
  hasNextPage: boolean = true;

  constructor(
    private authService: AuthService,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.loadFormTemplates();
  }

  getAuthHeaders(): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${this.authService.getToken()}`
    });
  }

  loadFormTemplates(): void {
    const offset = (this.currentPage - 1) * this.limit;
    const params = [`offset=${offset}`, `limit=${this.limit}`];
    if (this.searchQuery.trim()) {
      params.push(`name=${encodeURIComponent(this.searchQuery.trim())}`);
    }

    const url = `${this.apiUrl}/forms?${params.join('&')}`;
    this.http.get<any>(url, {
      headers: this.getAuthHeaders()
    }).subscribe({
      next: (res) => {
        this.formTemplates = res.data;
        this.hasNextPage = res.data.length === this.limit;
      },
      error: (err) => {
        console.error('Error fetching templates', err);
      }
    });
  }

  searchTemplates(): void {
    this.currentPage = 1;
    this.loadFormTemplates();
  }

  nextPage(): void {
    if (this.hasNextPage) {
      this.currentPage++;
      this.loadFormTemplates();
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadFormTemplates();
    }
  }

  addNewData(templateId: string): void {
    this.router.navigate(['/user-fill-form', templateId]);
  }

  viewMyData(templateId: string): void {
    this.router.navigate(['/user-view-data', templateId]);
  }

  logout(): void {
    this.authService.logout();
  }
}
