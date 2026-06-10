import {
  Component,
  Input,
  OnInit,
  SimpleChanges,
  OnChanges,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClientesService } from '../../services/clientes.service';

@Component({
  selector: 'app-clientes-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './clientes-admin.component.html',
})
export class ClientesAdminComponent implements OnInit, OnChanges {
  // Recibir el token desde el componente padre para saber cuando cambio
  @Input() token: string = '';
  nuevoNombreCliente: string = '';
  nuevoEmailCliente: string = '';    
  nuevoTelefonoCliente: string = ''; 
  listaClientes: any[] = [];

  constructor(
    private readonly clientesService: ClientesService,
    private readonly cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    if (localStorage.getItem('token')) {
      this.cargarClientes();
    }
  }

  
  ngOnChanges(changes: SimpleChanges) {
    if (changes['token'] && changes['token'].currentValue) {
      this.cargarClientes();
    }
  }

  cargarClientes() {
    this.clientesService.obtenerClientes().subscribe({
      next: (data) => {
        this.listaClientes = data.map((c) => ({
          ...c,
          proyectos: c.proyectos || [],
        }));
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar clientes:', err);
      },
    });
  }

  agregarCliente() {
    
    if (this.nuevoNombreCliente.trim() === '') return;

    
    this.clientesService
      .crearCliente(this.nuevoNombreCliente, this.nuevoEmailCliente, this.nuevoTelefonoCliente)
      .subscribe({
        next: () => {
      
          this.nuevoNombreCliente = '';
          this.nuevoEmailCliente = '';
          this.nuevoTelefonoCliente = '';
          this.cargarClientes();
        },
        error: (err) => {
          alert(err.error?.message || 'Error al crear cliente');
        },
      });
  }

  darBajaCliente(cliente: any) {
    this.clientesService.darBajaCliente(cliente.id).subscribe({
      next: () => {
        this.cargarClientes();
      },
      error: (err) => {
        alert(err.error?.message || 'Error al dar de baja');
      },
    });
  }
}