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
    return this.apollo.query<{ getAllEmployees: Employee[] }>({
      query: gql`
        query {
          getAllEmployees {
            id
            firstname
            lastname
            email
            position
            salary
            department
            date_of_joining
          }
        }
      `,
    }).pipe(map(result => result.data.getAllEmployees));
  }

  addEmployee(employee: Omit<Employee, "id">): Observable<Employee> {
    console.log("employee",employee)
    const mutation = gql`
mutation AddEmployee($firstname: String!, $lastname: String!, $email: String!, $gender: String!, $salary: Float!, $dateOfJoining: String!, $department: String!,$position:String!) {
  addEmployee(firstname: $firstname, lastname: $lastname, email: $email, gender: $gender, salary: $salary, date_of_joining: $dateOfJoining, department: $department, position:$position) {
    id
    firstname
    lastname
    email
    gender
    position
    salary
    department
    date_of_joining
  }
}

    `;

    const { firstname, lastname, email,  salary, date_of_joining, department, position } = employee;

    return this.apollo.mutate<{ addEmployee: Employee }>({
      mutation,
      variables: {
        firstname,
        lastname,
        email,
        salary,
      date_of_joining,
        department,
        position
      }
    }).pipe(map(result => result.data!.addEmployee));
  }

  getEmployeeById(eid: string): Observable<Employee> {
    return this.apollo.query<{ searchEmployeeById: Employee }>({
      query: gql`
        query GetEmployeeById($eid: ID!) {
          searchEmployeeById(eid: $eid) {
            id
            firstname
            lastname
            email
            position
            salary
            department
            date_of_joining
          }
        }
      `,
      variables: { eid },
    }).pipe(map(result => result.data.searchEmployeeById));
  }

  deleteEmployee(eid: string): Observable<boolean> {
    return this.apollo.mutate<{ deleteEmployee: boolean }>({
      mutation: gql`
        mutation DeleteEmployee($eid: ID!) {
          deleteEmployee(eid: $eid)
        }
      `,
      variables: { eid },
    }).pipe(map(result => result.data!.deleteEmployee));
  }

  searchEmployees(criteria: { designation?: string; department?: string }): Observable<Employee[]> {
    return this.apollo.query<{ searchEmployeesByDesignationOrDepartment: Employee[] }>({
      query: gql`
        query SearchEmployees($designation: String, $department: String) {
          searchEmployeesByDesignationOrDepartment(designation: $designation, department: $department) {
            id
            firstname
            lastname
            email
            position
            salary
            department
            date_of_joining
          }
        }
      `,
      variables: criteria,
    }).pipe(map(result => result.data.searchEmployeesByDesignationOrDepartment));
  }
}
