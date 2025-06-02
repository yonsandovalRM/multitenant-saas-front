import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { User } from '@/core/models/user';

export interface AuthResponse {
  accessToken: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
    isCoreUser: boolean;
    tenantId: string;
  };
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly apiUrl = environment.apiUrl;
  private readonly TOKEN_KEY = 'auth_token';
  private readonly TENANT_KEY = 'tenant_id';
  private readonly USER_KEY = 'user_data';

  private userSubject = new BehaviorSubject<User | null>(null);
  public user$ = this.userSubject.asObservable();

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(private readonly http: HttpClient) {
    // Cargar datos del usuario al inicializar el servicio
    this.loadUserFromStorage();
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/core/auth/login`, {
        email,
        password,
      })
      .pipe(
        tap((response) => {
          this.handleAuthSuccess(response);
        }),
      );
  }

  register(
    name: string,
    email: string,
    password: string,
  ): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/core/auth/register/core`, {
        name,
        email,
        password,
      })
      .pipe(
        tap((response) => {
          this.handleAuthSuccess(response);
        }),
      );
  }

  getProfile(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/core/auth/profile`);
  }

  private handleAuthSuccess(response: AuthResponse): void {
    // Guardar token
    localStorage.setItem(this.TOKEN_KEY, response.accessToken);

    // Guardar tenant ID
    localStorage.setItem(this.TENANT_KEY, response.user.tenantId);

    // Crear objeto User y guardarlo
    const user: User = {
      name: response.user.name,
      email: response.user.email,
      password: '', // No guardamos la contraseña
      role: response.user.role as any,
    };

    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    this.userSubject.next(user);
    this.isAuthenticatedSubject.next(true);
  }

  private loadUserFromStorage(): void {
    const token = this.getToken();
    const userData = localStorage.getItem(this.USER_KEY);

    if (token && userData) {
      try {
        const user = JSON.parse(userData);
        this.userSubject.next(user);
        this.isAuthenticatedSubject.next(true);
      } catch (error) {
        console.error('Error parsing user data from localStorage:', error);
        this.clearStorageData();
      }
    } else {
      this.isAuthenticatedSubject.next(false);
    }
  }

  private clearStorageData(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.TENANT_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getTenantId(): string | null {
    return localStorage.getItem(this.TENANT_KEY);
  }

  getCurrentUser(): User | null {
    return this.userSubject.value;
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    const isAuth = !!token;
    this.isAuthenticatedSubject.next(isAuth);
    return isAuth;
  }

  logout(): void {
    this.clearStorageData();
    this.userSubject.next(null);
    this.isAuthenticatedSubject.next(false);
    console.log('Usuario desconectado');
  }

  // Método específico para manejar sesiones expiradas
  handleSessionExpired(): void {
    console.warn('Sesión expirada. Limpiando datos de autenticación...');
    this.logout();
  }

  // Método para verificar si el token está presente y válido
  hasValidToken(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      // Opcional: Verificar si el token no está expirado
      // Puedes decodificar el JWT y verificar el campo 'exp'
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);

      if (payload.exp && payload.exp < currentTime) {
        console.warn('Token expirado');
        this.logout();
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error al validar token:', error);
      this.logout();
      return false;
    }
  }
}
