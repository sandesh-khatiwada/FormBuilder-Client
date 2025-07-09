import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})

export class AdminDashboardComponent implements OnInit {
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
    this.currentPage = 1; // reset to page 1
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

  navigateToCreateForm(): void {
    this.router.navigate(['/create-form']);
  }

  viewData(templateId: string): void {
    this.router.navigate(['/view-data', templateId]);
  }

  addNewData(templateId: string): void {
    this.router.navigate(['/fill-form', templateId]);
  }

  deleteTemplate(templateId: string): void {
    if (confirm('Are you sure you want to delete this form template?')) {
      this.http.delete(`${this.apiUrl}/forms/${templateId}`, {
        headers: this.getAuthHeaders()
      }).subscribe({
        next: () => {
          this.formTemplates = this.formTemplates.filter(t => t.templateId !== templateId);
        },
        error: (err) => {
          console.error('Delete failed', err);
        }
      });
    }
  }

  logout(): void {
    this.authService.logout();
  }
}
