import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login-form.component.html',
})
export class LoginFormComponent {
  nombreUsuarioInput: string = '';
  claveInput: string = '';
  mensajeLogin: string = '';

  @Output() readonly loginExitoso = new EventEmitter<any>();

  constructor(private readonly authService: AuthService) {}

  ejecutarLogin() {
    if (!this.nombreUsuarioInput || !this.claveInput) {
      this.mensajeLogin = 'Por favor, completa todos los campos.';
      return;
    }

    this.authService.login(this.nombreUsuarioInput, this.claveInput).subscribe({
      next: (res) => {
        this.mensajeLogin = 'Login exitoso';
        // Registrar token en almacenamiento local de forma explicita
        this.authService.guardarToken(res.token);
        // Notificar al componente padre
        this.loginExitoso.emit(res);
      },
      error: (err) => {
        console.error(err);
        this.mensajeLogin = err.error?.message || 'Usuario o clave incorrectos.';
      },
    });
  }
}
