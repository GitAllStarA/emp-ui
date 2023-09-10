import { Component, OnInit } from '@angular/core';
import { Employee } from './employeeInterface';
import { EmployeeService } from './employee.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ignoreElements } from 'rxjs';
import { NgForm } from '@angular/forms';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'uix';

  private emp: Employee[] = [];

  public editEmp: Employee | undefined;
  deleteEmp: Employee | undefined;

  constructor(private service: EmployeeService) {}

  ngOnInit(): void {
    this.fetchData();
  }

  get Emp() {
    return this.emp;
  }

  fetchData(): void {
    this.service.getEmpData().subscribe(
      (resp: Employee[]) => {
        this.emp = resp;
      },
      (error: Error) => {
        alert(error.message);
      },
      () => {
        console.log('completed fetch');
      }
    );
  }

  public onOpenModal(employee?: Employee, mode?: string): void {
    const container = document.getElementById('main-container');
    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-toggle', 'modal');
    if (mode === 'add') {
      button.setAttribute('data-target', '#addEmployeeModal');
    }
    if (mode === 'edit') {
      //Use a non-null assertion: If you're certain that employee will never be undefined when mode === 'edit', you can use the non-null assertion operator (!):
      this.editEmp = employee!;
      button.setAttribute('data-target', '#updateEmployeeModal');
    }
    if (mode === 'delete') {
      this.deleteEmp = employee;
      button.setAttribute('data-target', '#deleteEmployeeModal');
    }
    container?.appendChild(button);
    button.click();
  }

  public onAddEmployee(addForm: NgForm): void {
    document.getElementById('closeAddEmpModal')?.click();
    this.service.addEmpData(addForm.value).subscribe(
      (resp: Employee) => {
        console.log(resp);
        this.fetchData();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      },
      () => {
        addForm.reset();
      }
    );
  }

  public onEditEmployee(editForm: NgForm): void {
    document.getElementById('closeEditEmpModal')?.click();
    this.service.updateEmpData(editForm.value).subscribe(
      (response: Employee) => {
        console.log(response);
        this.fetchData();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  public onDeleteEmployee(empID: number): void {
    document.getElementById('closeEditEmpModal')?.click();
    this.service.deleteEmp(empID).subscribe(
      (response: void) => {
        console.log(response);
        this.fetchData();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  searchEmployees(key: String): void {
    console.log(key)
    const results: Employee[] = [];
    for (const emp of this.Emp) {
      if (
        emp.name.toLocaleLowerCase().indexOf(key.toLocaleLowerCase()) !== -1 
        || emp.jobTitle.toLocaleLowerCase().indexOf(key.toLocaleLowerCase()) !== -1 
        || emp.email.toLocaleLowerCase().indexOf(key.toLocaleLowerCase()) !== -1 
        || emp.phone.toLocaleLowerCase().indexOf(key.toLocaleLowerCase()) !== -1
      ) {
        results.push(emp);
      }
    }
    this.emp = results;
    if (results.length === 0 || key === '' || !key) {
      this.fetchData();
    }
  }
}
