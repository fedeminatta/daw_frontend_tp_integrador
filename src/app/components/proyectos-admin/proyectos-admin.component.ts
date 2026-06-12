import { Component, OnInit, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProyectosService } from '../../services/proyectos.service';
import { ClientesService } from '../../services/clientes.service';

@Component({
  selector: 'app-proyectos-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './proyectos-admin.component.html',
})
export class ProyectosAdminComponent implements OnInit {
  nuevoNombreProyecto: string = '';
  clienteSeleccionadoId: string = '';
  listaProyectos: any[] = [];
  listaClientes: any[] = [];

  @Output() readonly proyectoSeleccionado = new EventEmitter<any>();

  constructor(
    private readonly proyectosService: ProyectosService,
    private readonly clientesService: ClientesService,
    private readonly cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.cargarDatos();
  }

  // Cargar datos iniciales de la API
  cargarDatos() {
    this.proyectosService.obtenerProyectos().subscribe({
      next: (data) => {
        this.listaProyectos = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error(err),
    });

    this.clientesService.obtenerClientes().subscribe({
      next: (data) => {
        this.listaClientes = data.filter((c) => c.estado === 'Activo');
        this.cdr.detectChanges();
      },
      error: (err) => console.error(err),
    });
  }

  // Guardar nuevo proyecto
  agregarProyecto() {
    if (this.nuevoNombreProyecto.trim() === '') return;

    const idCliente = this.clienteSeleccionadoId === '' ? null : this.clienteSeleccionadoId;

    this.proyectosService.crearProyecto(this.nuevoNombreProyecto, idCliente).subscribe({
      next: () => {
        this.nuevoNombreProyecto = '';
        this.clienteSeleccionadoId = '';
        this.cargarDatos();
      },
      error: (err) => alert(err.error?.message || 'Error al crear proyecto'),
    });
  }

  // Eliminar proyecto de la base de datos
  eliminarProyecto(id: string) {
    if (!confirm('¿Seguro que deseas eliminar este proyecto?')) return;

    this.proyectosService.eliminarProyecto(id).subscribe({
      next: () => {
        this.cargarDatos();
        this.proyectoSeleccionado.emit(null); // Limpiar seccion de tareas en el padre
      },
      error: (err) => alert(err.error?.message || 'Error al eliminar proyecto'),
    });
  }

  // Emitir proyecto al componente padre
  seleccionarProyecto(proyecto: any) {
    this.proyectoSeleccionado.emit(proyecto);
  }

  // Habilitar el modo edicion en un proyecto especifico
  activarEdicion(proyecto: any) {
    proyecto.enEdicion = true;
    proyecto.nombreEditado = proyecto.nombre;
  }

  // Cancelar la edicion
  cancelarEdicion(proyecto: any) {
    proyecto.enEdicion = false;
  }

  // Guardar los cambios del proyecto en el backend
  guardarEdicion(proyecto: any) {
    if (!proyecto.nombreEditado || proyecto.nombreEditado.trim() === '') return;

    this.proyectosService.actualizarProyecto(proyecto.id, proyecto.nombreEditado).subscribe({
      next: () => {
        proyecto.enEdicion = false;
        this.cargarDatos();
        this.proyectoSeleccionado.emit(null); // Resetear seccion tareas para evitar desincronizacion
      },
      error: (err) => alert(err.error?.message || 'Error al actualizar proyecto'),
    });
  }
}
