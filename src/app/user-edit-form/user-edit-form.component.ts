import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../services/auth.service';

interface FormField {
  label: string;
  type: string;
  key: string;
  value: any;
  required?: boolean;
  options?: string[];
}

@Component({
  selector: 'app-user-edit-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './user-edit-form.component.html',
  styleUrls: ['./user-edit-form.component.css']
})
export class UserEditFormComponent implements OnInit {
  formDataId!: string;
  templateId!: string;
  jsonSchema: FormField[] = [];
  formValues: { [key: string]: any } = {};
  apiUrl = 'http://localhost:8090/api';
  isSubmitting = false;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.formDataId = this.route.snapshot.paramMap.get('formDataId')!;
    this.loadFormData();
  }

  getAuthHeaders(): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${this.authService.getToken()}`
    });
  }

  loadFormData(): void {

    this.http.get<any>(`${this.apiUrl}/forms/data/${this.formDataId}`, {
      headers: this.getAuthHeaders()
    }).subscribe({
      next: (res) => {
        const formDataResponse = res.data;
        const submittedData = formDataResponse.jsonData;
        this.templateId = this.route.snapshot.paramMap.get('templateId')!;

        // Build formValues from submittedData
        for (const field of submittedData) {
          this.formValues[field.key] = field.value;
        }

        // 2. Now fetch schema to get dropdown options
        this.fetchFormSchemaAndMerge(submittedData);
      },
      error: (err) => {
        console.error('Error loading form data', err);
        alert('Failed to load form data.');
      }
    });
  }

  fetchFormSchemaAndMerge(submittedData: any[]): void {
    this.http.get<any>(`${this.apiUrl}/forms/${this.templateId}`, {
      headers: this.getAuthHeaders()
    }).subscribe({
      next: (res) => {
        const schema = res.data.jsonSchema;

        // Merge schema with submitted values
        this.jsonSchema = submittedData.map((field) => {
          const schemaField = schema.find((s: any) => s.key === field.key);
          return {
            label: field.label,
            type: field.type,
            key: field.key,
            value: field.value,
            required: schemaField?.required || false,
            options: schemaField?.options || []
          };
        });
      },
      error: (err) => {
        console.error('Failed to fetch schema', err);
        alert('Failed to load form schema.');
      }
    });
  }

  onSubmit(): void {
    this.isSubmitting = true;

    const jsonData = this.jsonSchema.map(field => ({
      label: field.label,
      type: field.type,
      key: field.key,
      value: this.formValues[field.key]
    }));

    this.http.put<any>(`${this.apiUrl}/forms/data/${this.formDataId}`, { jsonData }, {
      headers: this.getAuthHeaders()
    }).subscribe({
      next: (res) => {
        this.isSubmitting = false;
        alert('Form updated successfully!');
        this.router.navigate(['/user-view-data', this.templateId]);
      },
      error: (err) => {
        this.isSubmitting = false;
        alert('Failed to update form.');
        console.error(err);
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/user-dashboard']);
  }
}
