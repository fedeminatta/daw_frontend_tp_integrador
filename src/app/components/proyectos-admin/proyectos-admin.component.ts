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

  // Emitir proyecto al componente padre
  seleccionarProyecto(proyecto: any) {
    this.proyectoSeleccionado.emit(proyecto);
  }
}
