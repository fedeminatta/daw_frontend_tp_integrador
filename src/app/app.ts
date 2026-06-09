import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  imports: [FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent {
  // === 1. DATOS DE LOGIN ===
  usuarioLogueado: boolean = false;
  nombreUsuarioInput: string = '';
  claveInput: string = '';
  mensajeLogin: string = '';
  usuarioActual: any = null;
  tokenUsuario: string = ''; // 🔑 Guardará el token en memoria para mostrarlo en el HTML

  // === 2. DATOS DE CLIENTES ===
  nuevoNombreCliente: string = '';
  listaClientes = [
    { id: 'cli-1', nombre: 'Cliente Alfa', estado: 'Activo', proyectos: ['proy-1'] },
    { id: 'cli-2', nombre: 'Distribuidora Entre Ríos', estado: 'Activo', proyectos: [] },
    { id: 'cli-3', nombre: 'Talleres Paraná', estado: 'Baja', proyectos: [] }
  ];

  // === 3. DATOS DE PROYECTOS ===
  nuevoNombreProyecto: string = '';
  clienteSeleccionadoId: string = '';
  listaProyectos = [
    { id: 'proy-1', nombre: 'Sistema de Stock', clienteId: 'cli-1', clienteNombre: 'Cliente Alfa', estado: 'Activo', tareas: ['Diseñar base de datos'] },
    { id: 'proy-2', nombre: 'Página Web Corporativa', clienteId: null, clienteNombre: 'Proyecto Interno', estado: 'Activo', tareas: [] }
  ];

  // === 4. DATOS DE TAREAS ===
  nuevaDescripcionTarea: string = '';
  proyectoSeleccionado: any = null;

  // ==========================================
  // FUNCIONES / MÉTODOS DEL SISTEMA
  // ==========================================

  // Simula el POST /usuarios/login devolviendo el Token
  ejecutarLogin() {
    if (this.nombreUsuarioInput === 'admin' && this.claveInput === 'admin123') {
      this.usuarioLogueado = true;
      this.mensajeLogin = '¡Login exitoso!';
      
      // Datos del usuario que entrega la API
      this.usuarioActual = { id: 'uuid-admin', nombreUsuario: 'admin', estado: 'Activo' };
      
      // Generamos el Token JWT simulado con la estructura Bearer
      this.tokenUsuario = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InV1aWQtYWRtaW4iLCJ1c2VyIjoiYWRtaW4ifQ.simulated_token_12345';
      
      // Guardamos el token en el LocalStorage del navegador
      localStorage.setItem('token', this.tokenUsuario);
    } else {
      this.mensajeLogin = 'Usuario o clave incorrectos (Prueba con admin / admin123)';
    }
  }

  // Limpia el LocalStorage al salir del sistema
  cerrarSesion() {
    this.usuarioLogueado = false;
    this.nombreUsuarioInput = '';
    this.claveInput = '';
    this.mensajeLogin = '';
    this.usuarioActual = null;
    this.tokenUsuario = '';
    localStorage.removeItem('token'); // 🧼 Borramos el token de la memoria
  }

  // Simula el POST /clientes (Protegido con Bearer)
  agregarCliente() {
    // Verificamos si el portador tiene el token en LocalStorage
    const token = localStorage.getItem('token');
    if (!token) {
      alert('❌ Error 401: No autorizado. Debes iniciar sesión (Falta Bearer Token en los Headers).');
      return;
    }

    if (this.nuevoNombreCliente.trim() === '') return;
    
    const nuevo = {
      id: 'cli-' + (this.listaClientes.length + 1),
      nombre: this.nuevoNombreCliente,
      estado: 'Activo',
      proyectos: []
    };
    this.listaClientes.push(nuevo);
    this.nuevoNombreCliente = '';
    console.log('POST /clientes exitoso. Header enviado -> Authorization: Bearer ' + token);
  }

  // Simula el PATCH /clientes/:id/baja (Baja lógica)
  darBajaCliente(cliente: any) {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('❌ Error 401: No autorizado para dar de baja clientes.');
      return;
    }

    if (cliente.proyectos.length > 0) {
      alert('¡Error! No se puede dar de baja porque tiene proyectos asociados.');
      return;
    }
    cliente.estado = 'Baja';
    console.log('PATCH /clientes/' + cliente.id + '/baja exitoso con Bearer Token.');
  }

  // Simula el POST /proyectos (Protegido con Bearer)
  agregarProyecto() {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('❌ Error 401: No autorizado. No puedes registrar proyectos sin tu Bearer Token.');
      return;
    }

    if (this.nuevoNombreProyecto.trim() === '') return;
    
    const cliente = this.listaClientes.find(c => c.id === this.clienteSeleccionadoId);
    const nombreCli = cliente ? cliente.nombre : 'Proyecto Interno';
    const idCli = cliente ? cliente.id : null;

    const nuevo = {
      id: 'proy-' + (this.listaProyectos.length + 1),
      nombre: this.nuevoNombreProyecto,
      clienteId: idCli,
      clienteNombre: nombreCli,
      estado: 'Activo',
      tareas: []
    };

    this.listaProyectos.push(nuevo);
    
    if (cliente) {
      cliente.proyectos.push(nuevo.id);
    }

    this.nuevoNombreProyecto = '';
    this.clienteSeleccionadoId = '';
    console.log('POST /proyectos exitoso. Header enviado -> Authorization: Bearer ' + token);
  }

  // Activa la vista de detalles de un proyecto
  seleccionarProyecto(proyecto: any) {
    this.proyectoSeleccionado = proyecto;
  }

  // Simula el POST /tareas (Protegido con Bearer)
  agregarTarea() {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('❌ Error 401: No autorizado. Inicia sesión para añadir tareas.');
      return;
    }

    if (this.nuevaDescripcionTarea.trim() === '' || !this.proyectoSeleccionado) return;
    this.proyectoSeleccionado.tareas.push(this.nuevaDescripcionTarea);
    this.nuevaDescripcionTarea = '';
    console.log('POST /tareas exitoso. Header enviado -> Authorization: Bearer ' + token);
  }

  // Simula el DELETE /tareas/:id (Protegido con Bearer)
  eliminarTarea(index: number) {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('❌ Error 401: No autorizado para eliminar tareas.');
      return;
    }
    
    if (this.proyectoSeleccionado) {
      this.proyectoSeleccionado.tareas.splice(index, 1);
      console.log('DELETE /tareas/' + index + ' exitoso con Bearer Token.');
    }
  }
}