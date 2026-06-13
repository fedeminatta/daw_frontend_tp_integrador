import { environment } from '../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly apiUrl = `${environment.apiUrl}/usuarios`;

  constructor(private readonly http: HttpClient) {}

  // Enviar credenciales al servidor
  login(nombreUsuario: string, clave: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { nombreUsuario, clave });
  }

  // Guardar token en el almacenamiento local
  guardarToken(token: string): void {
    localStorage.setItem('token', token);
  }

  // Obtener token del almacenamiento local
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Eliminar token del almacenamiento local
  cerrarSesion(): void {
    localStorage.removeItem('token');
  }

  // Verificar existencia del token
  estaLogueado(): boolean {
    return !!this.getToken();
  }
}
