import { environment } from '../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ClientesService {
  private readonly apiUrl = `${environment.apiUrl}/clientes`;

  constructor(private readonly http: HttpClient) {}

  // Leer token del almacenamiento local para armar las cabeceras
  private obtenerHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  obtenerClientes(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, { headers: this.obtenerHeaders() });
  }

  crearCliente(nombre: string, email: string, telefono: string): Observable<any> {
    return this.http.post<any>(
      this.apiUrl, 
      { nombre, email, telefono },
      { headers: this.obtenerHeaders() }
    );
  }

  darBajaCliente(id: string): Observable<any> {
    return this.http.patch<any>(
      `${this.apiUrl}/${id}/baja`,
      {},
      { headers: this.obtenerHeaders() },
    );
  }
}
