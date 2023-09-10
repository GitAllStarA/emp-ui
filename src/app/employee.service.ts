import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {HttpClient} from '@angular/common/http';
import { Employee } from './employeeInterface';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  private baseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  getEmpData(): Observable<Employee[]> {
    return this.http.get<Employee[]>(`${this.baseUrl}/all`)
  }

  findEmpById(id: number): Observable<Employee> {
    return this.http.get<Employee>(`${this.baseUrl}/find/${id}`)
  }

  addEmpData(emp: Employee): Observable<Employee> {
    return this.http.post<Employee>(`${this.baseUrl}/add`,emp);
  }

  updateEmpData(emp: Employee): Observable<Employee> {
    console.log(emp);
    return this.http.put<Employee>(this.baseUrl+"/update", emp);
  }

  deleteEmp(id: number) : Observable<void>  {
    return this.http.delete<void>(`${this.baseUrl}/delete/${id}`);
  }

}
45