
import { Component } from '@angular/core';

import { LoginServicesService } from '../../services/login-services.service';
import { Login } from '../../Interfaces/login';
import { MensajeError } from '../../Interfaces/mensaje-error';
import { FormBuilder, FormGroup, Validators, FormControl, ReactiveFormsModule } from '@angular/forms';
import {SharedServicesService} from '../../services/shared-services.service';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import Swal from 'sweetalert2';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from 'src/app/app.component';
@Component({
  selector: 'app-prueba-login',
  standalone: true,
  imports: [ReactiveFormsModule, 
    RouterModule, 
    HttpClientModule, 
     RouterOutlet],
  templateUrl: './prueba-login.component.html',
  styleUrls: ['./prueba-login.component.css'],
  
})
export class PruebaLoginComponent {

  users = [
    {value: 'cliente', viewValue: 'Cliente'},
    {value: 'empleado', viewValue: 'Empleado'},
    {value: 'admin', viewValue: 'Admin'}
  ];
  errorMessage: MensajeError | null = null;
  passwordVisible: boolean = true;
  disableSelect = new FormControl(false);
  loginForm: FormGroup;
  email: string = '';
  password: string = '';
  passwordStrength: string = '';
  isSelectActive: boolean = false; // Variable para controlar la animación del combobox
  userData : any;
  roles: string[] = ['cliente', 'empleado'];
  spinner: boolean = false;
  //loading
  cargando = false;
  mostrarContrasena: boolean = false;
  
  mostrar_contrasena() {
    this.mostrarContrasena = !this.mostrarContrasena
  }  

  constructor(private formBuilder: FormBuilder,  
              private loginService: LoginServicesService, 
              private app: AppComponent,
              private data:SharedServicesService,
              private router:Router) {
    this.loginForm = this.formBuilder.group({
      usuario: ['', [Validators.required, Validators.email]],
      contrasena: ['', Validators.required],
      rol: ['Usuario', Validators.required],
    });

    //ocultar el menu version movil para el login
    this.app.mostrarMenu = false;
  }

  onPasswordChange() {
    const password = this.loginForm.get('contrasena')?.value;

    if (password.length < 6) {
      this.passwordStrength = 'weak';
    } else if (password.length < 10) {
      this.passwordStrength = 'medium';
    } else {
      this.passwordStrength = 'strong';
    }
  }

  EventoEnviar(){
      //mensaje
    const usuario = this.loginForm.get('usuario')?.value;
    // Enviar datos al servicio
    this.data.enviarDatos( usuario );
  }
  
  onSubmit() {
    //activar loading
    this.cargando = true;
    //login
    const userData: Login = this.loginForm.value;

    this.spinner = true;

    this.loginService.LoginValidation(userData).subscribe(
      (response) => {

        this.errorMessage = null; // Limpiar el mensaje de error si hubo éxito
        
        this.router.navigate(['/menu/dashboard'])
        .then(() => window.location.reload())
        const userData2 = {
          usuario: this.loginForm.get('usuario')?.value,
          contrasena: this.loginForm.get('contrasena')?.value,
          rol: this.loginForm.get('rol')?.value,
        };

        localStorage.setItem('userData', JSON.stringify(userData2));
        this.userData = userData2;

        localStorage.setItem('userData', JSON.stringify(userData2));
        this.userData = userData2;
        const user2 = sessionStorage.setItem(
          'userData',
          this.loginForm.get('usuario')?.value
        );
      },
      (error) => {
        console.error('Error:', error);

        this.spinner = false;
        this.cargando = false;
        this.errorMessage = error.Message; 

        Swal.fire({
          title: 'ERROR',
          html: `${this.errorMessage}`,
          icon: 'error',
        });
      }
    );
    if (this.loginForm.valid) {
      console.log('Formulario válido');
      console.log('Email:', this.loginForm.value.email);
      console.log('Contraseña:', this.loginForm.value.password);
      console.log('Rol:', this.loginForm.value.role);
    }
  }

  toggleSelect() {
    this.isSelectActive = !this.isSelectActive;
  }

  direccionCambio(){
    this.router.navigate(['/cambiar-contrasena']);
  }
}
  
