import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DashboardService } from "../../services/dashboard.service";

@Component({
  selector: 'app-dashboard-admin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard-admin.component.html',
})
export class DashboardAdminComponent implements OnInit {
    stats: any = null;
    cargando = true;
    error = false;

    constructor(private readonly dashboardService: DashboardService){}

    ngOnInit(): void {
        this.cargarEstadisticas();
    
    }

    cargarEstadisticas(): void {
        this.dashboardService.obtenerEstadisiticas().subscribe({
            next: (data) => {
                this.stats = data;
                this.cargando = false;
            },
            error: (err) => {
              console.error('Error al traer metricas del back:', err);
              this.error = true;
              this.cargando = false;
            },

        });
    }
}