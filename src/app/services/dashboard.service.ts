import { environment } from '../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class DashboardService {
    private readonly apiUrl = `${environment.apiUrl}/dashboard/stats`;

    constructor(private readonly http: HttpClient) {}
        
        private obtenerHeaders(): HttpHeaders {
            const token = localStorage.getItem('token');
            return new HttpHeaders({
                Authorization: `Bearer ${token}`,
            });
        }

        obtenerEstadisiticas(): Observable<any> {
            return this.http.get<any>(this.apiUrl, { headers: this.obtenerHeaders()});
        }
    }