import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TareasService {
  private readonly apiUrl = 'http://localhost:3000/tareas';

  constructor(private readonly http: HttpClient) {}

  // Leer token para armar cabeceras
  private obtenerHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  // Crear una nueva tarea vinculada a un proyecto
  crearTarea(descripcion: string, proyectoId: string): Observable<any> {
    return this.http.post<any>(
      this.apiUrl,
      { descripcion, proyectoId },
      { headers: this.obtenerHeaders() },
    );
  }

  // Eliminar una tarea por su ID
  eliminarTarea(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`, { headers: this.obtenerHeaders() });
  }

  // Actualizar la descripcion de una tarea por su ID
  actualizarTarea(id: string, descripcion: string): Observable<any> {
    return this.http.patch<any>(
      `${this.apiUrl}/${id}`,
      { descripcion },
      { headers: this.obtenerHeaders() },
    );
  }
}
