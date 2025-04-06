import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { EmployeeService } from '../../services/employee.service';
import { Employee } from '../../../types/employeeType';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './employeelist.component.html',
  styleUrls: ['./employeelist.component.css'],
})
export class EmployeeListComponent implements OnInit, OnDestroy {
  employees: Employee[] | null = null;
  loading = false;
  error: string | null = null;
  private employeesSubscription?: Subscription;
  private deleteSubscription?: Subscription;

  constructor(private employeeService: EmployeeService, private router: Router) {

    this.loading=true
  }

  ngOnInit(): void {
    this.loadEmployees();
  }

  ngOnDestroy(): void {
    if (this.employeesSubscription) {
      this.employeesSubscription.unsubscribe();
    }
    if (this.deleteSubscription) {
      this.deleteSubscription.unsubscribe();
    }
  }

  loadEmployees(): void {
    this.loading = true;
    this.error = null;
    this.employeesSubscription = this.employeeService.getAllEmployees().subscribe({
      next: (employees) => {
        this.employees = employees;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load employees.';
        console.error(err);
        this.loading = false;
      },
    });
    console.log(this.employees)
  }

  deleteEmployee(id: string): void {
    if (confirm('Are you sure you want to delete this employee?')) {
      this.loading = true;
      this.error = null;
      this.deleteSubscription = this.employeeService.deleteEmployee(id).subscribe({
        next: (success) => {
          if (success) {
            this.loadEmployees(); // Reload the employee list
          } else {
            this.error = 'Failed to delete employee.';
            this.loading = false;
          }
        },
        error: (err) => {
          this.error = 'Failed to delete employee.';
          console.error(err);
          this.loading = false;
        },
      });
    }
  }

  logout(): void {
    localStorage.removeItem('authToken'); // Clear token
    this.router.navigate(['/login']);
  }
}
