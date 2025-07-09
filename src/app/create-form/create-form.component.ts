import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-form.component.html',
  styleUrls: ['./create-form.component.css']
})
export class CreateFormComponent {
  formName = '';
  allowEdit = false;
  jsonSchema: any[] = [];
  isSubmitting = false;
  apiUrl = 'http://localhost:8090/api';

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {}

  getAuthHeaders(): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${this.authService.getToken()}`
    });
  }

  addField(): void {
    this.jsonSchema.push({
      label: '',
      type: 'text',
      key: '',
      required: false,
      optionsInput: '' // for dropdown only
    });
  }

  removeField(index: number): void {
    this.jsonSchema.splice(index, 1);
  }

    goBack(): void {
    this.router.navigate(['/admin-dashboard']);
  }

  onSubmit(): void {
    if (!this.formName.trim()) {
      alert('Form name is required');
      return;
    }

    for (const field of this.jsonSchema) {
      if (!field.label.trim() || !field.key.trim()) {
        alert('All fields must have a label and key.');
        return;
      }
    }

    // Convert dropdown optionsInput to options array
    const schemaWithParsedOptions = this.jsonSchema.map(field => {
      const fieldCopy = { ...field };
      if (field.type === 'dropdown' && field.optionsInput) {
      fieldCopy.options = field.optionsInput
      .split(',')
      .map((opt: string) => opt.trim())
      .filter((opt: string) => opt);
      }
      delete fieldCopy.optionsInput;
      return fieldCopy;
    });

    const body = {
      name: this.formName,
      jsonSchema: schemaWithParsedOptions,
      allowEdit: this.allowEdit
    };

    this.isSubmitting = true;

    this.http.post<any>(`${this.apiUrl}/forms`, body, {
      headers: this.getAuthHeaders()
    }).subscribe({
      next: (res) => {
        this.isSubmitting = false;
        if (res.success) {
          alert('Form template created successfully!');
          this.router.navigate(['/admin-dashboard']);
        } else {
          alert('Failed to create form template.');
        }
      },
      error: (err) => {
        this.isSubmitting = false;
        console.error('Create form error:', err);
        alert('Error creating form template. Please try again.');
      }
    });
  }
}
