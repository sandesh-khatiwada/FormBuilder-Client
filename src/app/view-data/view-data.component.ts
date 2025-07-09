import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-view-data',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './view-data.component.html',
  styleUrls: ['./view-data.component.css']
})
export class ViewDataComponent implements OnInit {
  templateId!: string;
  formData: any[] = [];
  headers: string[] = [];
  currentPage: number = 1;
  limit: number = 10;
  hasNextPage: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.templateId = this.route.snapshot.paramMap.get('templateId')!;
    this.loadData();
  }

  getAuthHeaders(): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${this.authService.getToken()}`
    });
  }

  loadData(): void {
    const offset = (this.currentPage - 1) * this.limit;

    this.http
      .get<any>(`http://localhost:8090/api/forms/${this.templateId}/data?offset=${offset}&limit=${this.limit}`, {
        headers: this.getAuthHeaders()
      })
      .subscribe({
        next: (res) => {
          this.formData = res.data;

          if (this.formData.length > 0) {
            this.headers = this.formData[0].jsonData.map((field: any) => field.label);
          }

          this.hasNextPage = this.formData.length === this.limit;
        },
        error: (err) => {
          console.error('Error fetching form data', err);
        }
      });
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
    this.router.navigate(['/admin-dashboard']);
  }

  formatValue(cell: any): string {
  if (cell.type === 'datetime' && typeof cell.value === 'string') {
    return cell.value.replace('T', ' ');
  }
  return cell.value;
}


exportToExcel(): void {
  const url = `http://localhost:8090/api/forms/${this.templateId}/data/excel-sheet`;
  const headers = new HttpHeaders({
    Authorization: `Bearer ${this.authService.getToken()}`,
  });

  this.http.get(url, {
    headers,
    responseType: 'blob'  // 👈 important to get binary Excel data
  }).subscribe({
    next: (blob) => {
      const fileName = `form-data-${this.templateId}.xlsx`;

      // Create a temporary anchor to trigger download
      const a = document.createElement('a');
      const objectUrl = URL.createObjectURL(blob);
      a.href = objectUrl;
      a.download = fileName;
      a.click();
      URL.revokeObjectURL(objectUrl);
    },
    error: (err) => {
      console.error('Failed to download Excel file', err);
      alert('Failed to export Excel. Please try again.');
    }
  });
}

}
