import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { ClientesAdminComponent } from './components/clientes-admin/clientes-admin.component';
import { ProyectosAdminComponent } from './components/proyectos-admin/proyectos-admin.component';
import { TareasAdminComponent } from './components/tareas-admin/tareas-admin.component';
import { DashboardAdminComponent } from './components/dashboard-admin/dashboard-admin.component'

@Component({
  selector: 'app-root',
  standalone: true,
  // Incluir en el arreglo de imports
  imports: [
    CommonModule,
    LoginFormComponent,
    ClientesAdminComponent,
    ProyectosAdminComponent,
    TareasAdminComponent,
    DashboardAdminComponent,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class AppComponent implements OnInit {
  usuarioLogueado: boolean = false;
  usuarioActual: any = null;
  tokenUsuario: string = '';
  proyectoSeleccionado: any = null;

  constructor(private readonly authService: AuthService) {}

  ngOnInit() {
    if (this.authService.estaLogueado()) {
      this.usuarioLogueado = true;
      this.tokenUsuario = this.authService.getToken() || '';
      this.usuarioActual = { nombreUsuario: 'admin', estado: 'Activo' };
    }
  }

  alLoguearse(evento: any) {
    this.tokenUsuario = evento.token;
    this.usuarioLogueado = true;
    this.usuarioActual = { id: evento.id, nombreUsuario: evento.nombreUsuario, estado: 'Activo' };
  }

  cerrarSesion() {
    this.authService.cerrarSesion();
    this.usuarioLogueado = false;
    this.tokenUsuario = '';
    this.usuarioActual = null;
    this.proyectoSeleccionado = null;
  }

  alSeleccionarProyecto(proyecto: any) {
    this.proyectoSeleccionado = proyecto;
  }
}
