import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-user-view-data',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './user-view-data.component.html',
  styleUrls: ['./user-view-data.component.css']
})
export class UserViewDataComponent implements OnInit {
  templateId!: string;
  formData: any[] = [];
  headers: string[] = [];
  currentPage: number = 1;
  limit: number = 10;
  hasNextPage: boolean = true;
  allowEdit: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.templateId = this.route.snapshot.paramMap.get('templateId')!;
    this.fetchTemplateInfoAndLoadData();
  }

  getAuthHeaders(): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${this.authService.getToken()}`
    });
  }

  fetchTemplateInfoAndLoadData(): void {
    const headers = this.getAuthHeaders();
    this.http.get<any>(`http://localhost:8090/api/forms/${this.templateId}`, { headers }).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.allowEdit = res.data.allowEdit;
        }
        this.loadData();
      },
      error: (err) => {
        console.error('Error fetching template info:', err);
        this.loadData(); 
      }
    });
  }

  loadData(): void {
    const offset = (this.currentPage - 1) * this.limit;
    const url = `http://localhost:8090/api/forms/${this.templateId}/response?offset=${offset}&limit=${this.limit}`;

    this.http.get<any>(url, {
      headers: this.getAuthHeaders()
    }).subscribe({
      next: (res) => {
        this.formData = res.data;
        if (this.formData.length > 0) {
          this.headers = this.formData[0].jsonData.map((field: any) => field.label);
        }
        this.hasNextPage = this.formData.length === this.limit;
      },
      error: (err) => {
        console.error('Error fetching user form data', err);
      }
    });
  }

  editForm(formDataId: string): void {
    this.router.navigate(['/user-edit-form', formDataId, this.templateId]);
  }

  deleteForm(formDataId: string): void {
    if (confirm('Are you sure you want to delete this submission?')) {
      const headers = new HttpHeaders({
        Authorization: `Bearer ${this.authService.getToken()}`,
      });

      this.http
        .delete(`http://localhost:8090/api/forms/${formDataId}/data`, { headers })
        .subscribe({
          next: () => {
            this.formData = this.formData.filter((d) => d.formDataId !== formDataId);
            alert('Form deleted successfully!');
          },
          error: (err) => {
            console.error('Delete error:', err);
            alert('Failed to delete. Please try again.');
          },
        });
    }
  }

  nextPage(): void {
    if (this.hasNextPage) {
      this.currentPage++;
      this.loadData();
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadData();
    }
  }

  goBack(): void {
    this.router.navigate(['/user-dashboard']);
  }

  formatValue(cell: any): string {
    if (cell.type === 'datetime' && typeof cell.value === 'string') {
      return cell.value.replace('T', ' ');
    }
    return cell.value;
  }
}
