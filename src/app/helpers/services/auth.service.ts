import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private readonly http: HttpClient) {}

  login(email: string, password: string) {
    return this.http.post(`${this.apiUrl}/core/auth/login`, {
      email,
      password,
    });
  }

  register(name: string, email: string, password: string) {
    return this.http.post(`${this.apiUrl}/core/auth/register/core`, {
      name,
      email,
      password,
    });
  }

  getProfile() {
    return this.http.get(`${this.apiUrl}/core/auth/profile`);
  }
}
