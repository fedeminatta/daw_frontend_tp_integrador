import { Component, Input, OnChanges, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TareasService } from '../../services/tareas.service';
import { ProyectosService } from '../../services/proyectos.service';

@Component({
  selector: 'app-tareas-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tareas-admin.component.html',
})
export class TareasAdminComponent implements OnChanges {
  @Input() proyecto: any = null;
  nuevaDescripcionTarea: string = '';
  listaTareas: any[] = [];

  constructor(
    private readonly tareasService: TareasService,
    private readonly proyectosService: ProyectosService,
    private readonly cdr: ChangeDetectorRef,
  ) {}

  // Detectar cambios cuando el usuario selecciona otro proyecto
  ngOnChanges(changes: SimpleChanges) {
    if (changes['proyecto'] && this.proyecto) {
      this.listaTareas = this.proyecto.tareas || [];
      this.cdr.detectChanges();
    }
  }

  // Refrescar las tareas consultando al servicio de proyectos
  actualizarLista() {
    this.proyectosService.obtenerProyectos().subscribe({
      next: (proyectos) => {
        const actualizado = proyectos.find((p) => p.id === this.proyecto.id);
        if (actualizado) {
          this.listaTareas = actualizado.tareas || [];
          this.cdr.detectChanges();
        }
      },
      error: (err) => console.error(err),
    });
  }

  // Registrar nueva tarea
  agregarTarea() {
    if (this.nuevaDescripcionTarea.trim() === '' || !this.proyecto) return;

    this.tareasService.crearTarea(this.nuevaDescripcionTarea, this.proyecto.id).subscribe({
      next: () => {
        this.nuevaDescripcionTarea = '';
        this.actualizarLista();
      },
      error: (err) => alert(err.error?.message || 'Error al crear tarea'),
    });
  }

  // Eliminar tarea de la base de datos
  eliminarTarea(id: string) {
    this.tareasService.eliminarTarea(id).subscribe({
      next: () => {
        this.actualizarLista();
      },
      error: (err) => alert(err.error?.message || 'Error al eliminar tarea'),
    });
  }
}
