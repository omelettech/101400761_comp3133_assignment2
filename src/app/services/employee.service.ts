import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Employee } from '../../types/employeeType';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  constructor(private apollo: Apollo) {}

  getAllEmployees(): Observable<Employee[]> {
    return this.apollo.query<{ employees: Employee[] }>({
      query: gql`
        query GetAllEmployees {
          employees {
            id
            firstName
            lastName
            email
            department
            position
            profilePicture
          }
        }
      `,
    }).pipe(map(result => result.data.employees));
  }

  addEmployee(employee: Omit<Employee, "id">, profilePictureFile?: File | null): Observable<Employee> {
    const mutation = gql`
      mutation AddEmployee($employee: EmployeeInput!, $profilePicture: Upload) {
        addEmployee(employee: $employee, profilePicture: $profilePicture) {
          id
          firstName
          lastName
          email
          department
          position
          profilePicture
        }
      }
    `;
    return this.apollo.mutate<{ addEmployee: Employee }>(
      {
        mutation,
        variables: {
          employee,
          profilePicture: profilePictureFile,
        },
        context: {
          useMultipart: true, // Important for file uploads
        },
      }
    ).pipe(map(result => result.data!.addEmployee));
  }

  getEmployeeById(id: string): Observable<Employee> {
    return this.apollo.query<{ employee: Employee }>({
      query: gql`
        query GetEmployeeById($id: ID!) {
          employee(id: $id) {
            id
            firstName
            lastName
            email
            department
            position
            profilePicture
          }
        }
      `,
      variables: { id },
    }).pipe(map(result => result.data!.employee));
  }

  updateEmployee(id: string, employee: Omit<Employee, "id">, profilePictureFile?: File | null): Observable<Employee> {
    const mutation = gql`
      mutation UpdateEmployee($id: ID!, $employee: EmployeeInput!, $profilePicture: Upload) {
        updateEmployee(id: $id, employee: $employee, profilePicture: $profilePicture) {
          id
          firstName
          lastName
          email
          department
          position
          profilePicture
        }
      }
    `;
    return this.apollo.mutate<{ updateEmployee: Employee }>(
      {
        mutation,
        variables: {
          id,
          employee,
          profilePicture: profilePictureFile,
        },
        context: {
          useMultipart: true,
        },
      }
    ).pipe(map(result => result.data!.updateEmployee));
  }

  deleteEmployee(id: string): Observable<boolean> {
    return this.apollo.mutate<{ deleteEmployee: boolean }>({
      mutation: gql`
        mutation DeleteEmployee($id: ID!) {
          deleteEmployee(id: $id)
        }
      `,
      variables: { id },
    }).pipe(map(result => result.data!.deleteEmployee));
  }
  searchEmployees(criteria: { department?: string; position?: string }): Observable<Employee[]> {
    return this.apollo.query<{ searchEmployees: Employee[] }>({
      query: gql`
      query SearchEmployees($department: String, $position: String) {
        searchEmployees(department: $department, position: $position) {
          id
          firstName
          lastName
          email
          department
          position
          profilePicture
        }
      }
    `,
      variables: criteria,
    }).pipe(map(result => result.data.searchEmployees));
  }
}
