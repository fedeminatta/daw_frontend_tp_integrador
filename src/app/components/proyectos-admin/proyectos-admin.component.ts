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

  seleccionarProyecto(proyecto: any) {
    this.proyectoSeleccionado.emit(proyecto);
  }

  activarEdicion(proyecto: any) {
    proyecto.enEdicion = true;
    proyecto.nombreEditado = proyecto.nombre;
  }

  cancelarEdicion(proyecto: any) {
    proyecto.enEdicion = false;
  }

  guardarEdicion(proyecto: any) {
    if (!proyecto.nombreEditado || proyecto.nombreEditado.trim() === '') return;

    this.proyectosService.actualizarProyecto(proyecto.id, proyecto.nombreEditado).subscribe({
      next: () => {
        proyecto.enEdicion = false;
        this.cargarDatos();
        this.proyectoSeleccionado.emit(null);
      },
      error: (err) => alert(err.error?.message || 'Error al actualizar proyecto'),
    });
  }

  exportarReporteGeneralCSV() {
    if (this.listaProyectos.length === 0) {
      alert('No hay proyectos disponibles para exportar');
      return;
    }

    const encabezados = [
      'ID Cliente',
      'Nombre Cliente',
      'ID Proyecto',
      'Nombre Proyecto',
      'ID Tarea',
      'Descripcion Tarea',
    ];

    const filas: string[][] = [];

    // Recorrer los proyectos para cargar los datos
    this.listaProyectos.forEach((proyecto) => {
      const clienteId = proyecto.cliente?.id || 'N/A';
      const clienteNombre = proyecto.cliente?.nombre
        ? proyecto.cliente.nombre.replace(/,/g, ' ')
        : 'Proyecto Interno';
      const proyectoId = proyecto.id;
      const proyectoNombre = proyecto.nombre ? proyecto.nombre.replace(/,/g, ' ') : '';

      if (proyecto.tareas && proyecto.tareas.length > 0) {
        proyecto.tareas.forEach((tarea: any) => {
          filas.push([
            clienteId,
            clienteNombre,
            proyectoId,
            proyectoNombre,
            tarea.id,
            tarea.descripcion ? tarea.descripcion.replace(/,/g, ' ') : '',
          ]);
        });
      } else {
        // Si el proyecto no tiene tareas, crear una fila igual dejando los campos de tareas vacios
        filas.push([
          clienteId,
          clienteNombre,
          proyectoId,
          proyectoNombre,
          'S/T',
          'Sin tareas asignadas',
        ]);
      }
    });

    // Unir encabezados y filas con BOM UTF-8 para que Excel reconozca los acentos correctamente
    const contenidoCsv = [encabezados.join(','), ...filas.map((fila) => fila.join(','))].join('\n');

    // El prefijo \uFEFF fuerza a Excel a leer el archivo en formato UTF-8 nativo
    const blob = new Blob(['\uFEFF' + contenidoCsv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    // Crear enlace y descargar
    const enlaceDescarga = document.createElement('a');
    enlaceDescarga.href = url;
    enlaceDescarga.setAttribute(
      'download',
      `reporte_general_proyectos_${new Date().toISOString().slice(0, 10)}.csv`,
    );
    document.body.appendChild(enlaceDescarga);
    enlaceDescarga.click();
    document.body.removeChild(enlaceDescarga);
  }
}
