import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProyectosService {
  private readonly apiUrl = 'http://localhost:3000/proyectos';

  constructor(private readonly http: HttpClient) {}

  // Leer token para armar cabeceras
  private obtenerHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  // Obtener lista de proyectos
  obtenerProyectos(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, { headers: this.obtenerHeaders() });
  }

  // Crear nuevo proyecto
  crearProyecto(nombre: string, clienteId: string | null): Observable<any> {
    return this.http.post<any>(
      this.apiUrl,
      { nombre, clienteId },
      { headers: this.obtenerHeaders() },
    );
  }

  // Eliminar un proyecto por su ID
  eliminarProyecto(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`, { headers: this.obtenerHeaders() });
  }

  // Actualizar un proyecto por su ID
  actualizarProyecto(id: string, nombre: string): Observable<any> {
    return this.http.patch<any>(
      `${this.apiUrl}/${id}`,
      { nombre },
      { headers: this.obtenerHeaders() },
    );
  }
}
