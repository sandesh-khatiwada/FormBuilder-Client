import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-fill-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './fill-form.component.html',
  styleUrls: ['./fill-form.component.css']
})
export class FillFormComponent implements OnInit {
  templateId!: string;
  jsonSchema: any[] = [];
  formData: { [key: string]: any } = {};
  provideResponse: boolean = false;
  apiUrl = 'http://localhost:8090/api';
  isSubmitting = false;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.templateId = this.route.snapshot.paramMap.get('templateId')!;
    this.loadFormTemplate();
  }

  getAuthHeaders(): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${this.authService.getToken()}`
    });
  }

  loadFormTemplate(): void {
    this.http.get<any>(`${this.apiUrl}/forms/${this.templateId}`, {
      headers: this.getAuthHeaders()
    }).subscribe({
      next: (res) => {
        if (res.success && res.data && res.data.jsonSchema) {
          this.jsonSchema = res.data.jsonSchema;
        }
      },
      error: (err) => {
        console.error('Error loading form template', err);
      }
    });
  }

  
 onSubmit(): void {
  this.isSubmitting = true; // start submitting state

  const jsonData = this.jsonSchema.map(field => {
    let value = this.formData[field.key];
    if (field.type === 'number' && value !== null && value !== undefined && value !== '') {
      value = Number(value);
    }
    return {
      label: field.label,
      type: field.type,
      key: field.key,
      value: value ?? null
    };
  });

  const body = { jsonData };

  this.http.post<any>(
    `${this.apiUrl}/forms/${this.templateId}/data?provideResponse=${this.provideResponse}`,
    body,
    { headers: this.getAuthHeaders() }
  ).subscribe({
    next: (res) => {
      this.isSubmitting = false;
      alert('Form submitted successfully!');
      this.router.navigate(['/admin-dashboard']);
    },
    error: (err) => {
      this.isSubmitting = false;

      // Your error handling code here (cleaned error messages)
      if (err.error && err.error.status === 'BAD_REQUEST' && Array.isArray(err.error.errors)) {
        const prefix = 'Error parsing form data: Error processing form data: ';
        const cleanedErrors = err.error.errors.map((errorMsg: string) => {
          return errorMsg.startsWith(prefix) ? errorMsg.slice(prefix.length) : errorMsg;
        });
        alert(cleanedErrors.join('\n'));
      } else if (err.error && err.error.message) {
        alert(err.error.message);
      } else {
        alert('Submission failed. Please try again.');
      }
    }
  });
}


  goBack(): void {
    this.router.navigate(['/admin-dashboard']);
  }


}
