import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { ClientesAdminComponent } from './components/clientes-admin/clientes-admin.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, LoginFormComponent, ClientesAdminComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class AppComponent implements OnInit {
  usuarioLogueado: boolean = false;
  usuarioActual: any = null;
  tokenUsuario: string = '';

  //  datos mockeados de proyectos y tareas hasta conectarlos
  listaProyectos: any[] = [];
  proyectoSeleccionado: any = null;
  nuevoNombreProyecto: string = '';
  clienteSeleccionadoId: string = '';
  nuevaDescripcionTarea: string = '';

  constructor(private readonly authService: AuthService) {}

  ngOnInit() {
    // Si el usuario ya tenia sesion iniciada al recargar se recupera
    if (this.authService.estaLogueado()) {
      this.usuarioLogueado = true;
      this.tokenUsuario = this.authService.getToken() || '';
      this.usuarioActual = { nombreUsuario: 'admin', estado: 'Activo' }; // Mock básico
    }
  }

  alLoguearse(evento: any) {
    this.tokenUsuario = evento.token;
    this.usuarioLogueado = true;

    this.usuarioActual = {
      id: evento.id,
      nombreUsuario: evento.nombreUsuario,
      estado: 'Activo',
    };
  }

  cerrarSesion() {
    this.authService.cerrarSesion();
    this.usuarioLogueado = false;
    this.tokenUsuario = '';
    this.usuarioActual = null;
  }

  seleccionarProyecto(proyecto: any) {
    this.proyectoSeleccionado = proyecto;
  }
  agregarProyecto() {}
  agregarTarea() {}
  eliminarTarea(i: number) {}
}
