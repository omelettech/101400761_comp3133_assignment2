import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { EmployeeService } from '../../services/employee.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import {Employee} from '../../../types/employeeType';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './employee-form.component.html',
  styleUrls: ['./employee-form.component.css'],
})
export class EmployeeFormComponent implements OnInit, OnDestroy {
  employeeForm: FormGroup;
  isAddMode: boolean = true;
  id: string | null = null;
  loading = false;
  error: string | null = null;
  successMessage: string | null = null;
  selectedFile: File | null = null;
  previewImage: string | null = null;
  profilePictureError: string | null = null;

  private routeSubscription?: Subscription;
  private employeeSubscription?: Subscription;
  private saveSubscription?: Subscription;

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.employeeForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      department: ['', Validators.required],
      position: ['', Validators.required],
      // profilePicture: [null] // We'll handle file separately
    });
  }

  ngOnInit(): void {
    this.routeSubscription = this.route.params.subscribe((params) => {
      this.id = params['id'];
      this.isAddMode = !this.id;

      if (!this.isAddMode) {
        this.loading = true;
        this.employeeSubscription = this.employeeService.getEmployeeById(this.id!).subscribe({
          next: (employee) => {
            this.employeeForm.patchValue(employee);
            this.previewImage = employee.profilePicture || null;
            this.loading = false;
          },
          error: (err) => {
            this.error = 'Failed to load employee for update.';
            console.error(err);
            this.loading = false;
          },
        });
      }
    });
  }

  ngOnDestroy(): void {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
    if (this.employeeSubscription) {
      this.employeeSubscription.unsubscribe();
    }
    if (this.saveSubscription) {
      this.saveSubscription.unsubscribe();
    }
  }

  onFileChange(event: any): void {
    this.selectedFile = event.target.files[0];
    this.previewImage = null;
    this.profilePictureError = null;

    if (this.selectedFile) {
      const allowedTypes = ['image/png', 'image/jpeg', 'image/gif'];
      if (!allowedTypes.includes(this.selectedFile.type)) {
        this.profilePictureError = 'Invalid file type. Only PNG, JPEG, and GIF are allowed.';
        this.selectedFile = null;
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        this.previewImage = reader.result as string;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  onSubmit(): void {
    if (this.employeeForm.valid && !this.loading && !this.profilePictureError) {
      this.loading = true;
      this.error = null;
      this.successMessage = null;
      const employeeData = this.employeeForm.value;

      const saveObservable = this.isAddMode
        ? this.employeeService.addEmployee(employeeData, this.selectedFile)
        : this.employeeService.updateEmployee(this.id!, employeeData, this.selectedFile);

      this.saveSubscription = saveObservable.subscribe({
        next: (employee) => {
          this.successMessage = `Employee ${this.isAddMode ? 'added' : 'updated'} successfully!`;
          this.loading = false;
          setTimeout(() => this.router.navigate(['/employees']), 1500); // Redirect after a short delay
        },
        error: (err) => {
          this.error = `Failed to ${this.isAddMode ? 'add' : 'update'} employee.`;
          console.error(err);
          this.loading = false;
        },
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/employees']);
  }
}
