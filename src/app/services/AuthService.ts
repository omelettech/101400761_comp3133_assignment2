import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private token: string|null|undefined;

  constructor(private http: HttpClient) {}

  login(credentials: any): Observable<any> {
    // Replace with your actual API endpoint
    return this.http.post('/api/login', credentials);
  }

  setToken(token: string) {
    this.token = token;
    // Optionally, store token in localStorage:
    localStorage.setItem('userToken', token);
  }

  getToken(): string|null {
    return this.token || localStorage.getItem('userToken');
  }

  logout() {
    this.token = '';
    localStorage.removeItem('userToken');
  }
}
