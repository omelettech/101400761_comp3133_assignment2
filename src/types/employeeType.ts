export interface Employee {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  position: string;
  salary: number;
  department: string;
  date_of_joining: string;
}
export interface EmployeeSaveInput {
  employeeData: Omit<Employee, "id">;
  profilePictureFile?: File | null;
}
