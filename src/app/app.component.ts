
import { Component, ElementRef, ViewChild } from '@angular/core';
import { OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { initFlowbite } from 'flowbite';
import { LoginServicesService } from './services/login-services.service';
import { HttpClientModule } from '@angular/common/http';
import { UsuariosServicesService } from './services/usuarios-services.service';
import { Imagen } from './Interfaces/imagen';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HttpClientModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'web-app';

  isCollapsed = false;
  isAdmin = false;
  isEmpleado = false;
  isCliente = false;
  username: string = '';
  rol: string = '';
  mostrarMenu = true;
  dataImagen: Imagen[] = [];
  imagenUser: string = "";
  /*animaciones*/
  rotacionProductos = false;
  rotacionPeticiones = false;
  rotacionHistorial = false;
  
  constructor(private login: LoginServicesService, private router: Router, private servicio: UsuariosServicesService) { }

  ngOnInit(): void {
    initFlowbite();
    this.obtenerImagenUserxd();

    const userDataString = localStorage.getItem('userData');
    if (userDataString) {
      try {
        // Intenta analizar la cadena como JSON
        const userData = JSON.parse(userDataString);
        this.isAdmin = userData.rol === 'admin';
        this.isEmpleado = userData.rol === 'empleado';
        this.username = userData.usuario; // Actualiza la propiedad 'username' con el valor correcto
        this.rol = userData.rol;
      } catch (error) {
        // En caso de un error al analizar JSON, puedes manejarlo o simplemente retornar false
        console.error('Error al analizar JSON:', error);
      }
    }
  }

  esAdmin(): boolean {
    // Recupera la información del usuario desde localStorage
    const userDataString = localStorage.getItem('userData');
    if (userDataString) {
      try {
        // Intenta analizar la cadena como JSON
        const userData = JSON.parse(userDataString);
        return userData.rol === 'admin'; // Verifica la propiedad correcta 'rol'
      } catch (error) {
        // En caso de un error al analizar JSON, puedes manejarlo o simplemente retornar false
        console.error('Error al analizar JSON:', error);
        return false;
      }
    }
    return false; // Retorna false si no se encuentra información del usuario
  }

  esEmpleado(): boolean {
    const userDataString = localStorage.getItem('userData');
    if (userDataString) {
      try {
        const userData = JSON.parse(userDataString);
        return userData.rol === 'empleado';
      } catch (error) {
        console.error('Error al aalizar JSON:', error)
        return false;
      }
    }
    return false;

  }

  esCliente(): boolean {
    const userDataString = localStorage.getItem('userData');
    if (userDataString) {
      try {
        const userData = JSON.parse(userDataString);
        return userData.rol === 'cliente';
      } catch (error) {
        console.error('Error al aalizar JSON:', error)
        return false;
      }
    }
    return false;
  }


  obtenerImagenUserxd() {
    const userDataString = localStorage.getItem('userData');
    if (userDataString) {
      const userData = JSON.parse(userDataString);

      // Extraer solo el id de usuario
      const username = userData.usuario;

      this.servicio.obtenerImagenUser(username).subscribe(
        (response) => {
          this.imagenUser = (response)
        },
        (error) => {
          console.error('Error al obtener la imagen:', error);
        }
      );
    }
    return false;
  }

  //**animaciones**///
  // menu del navbar
  //animacion para alerta
  toggleProductos() {
    this.rotacionProductos = !this.rotacionProductos;
  }

  togglePeticiones() {
    this.rotacionPeticiones = !this.rotacionPeticiones;
  }

  toggleHistorial() {
    this.rotacionHistorial = !this.rotacionHistorial;
  }

  //**Redirecciones**

  //login
  direccionLogin() { this.router.navigate(['/prueba-login']).then(() => window.location.reload()); }
  //Home
  home() { this.router.navigate(['/menu/dashboard']).then(() => window.location.reload()); }
  //Productos
  montarPedido() { this.router.navigate(['/menu/productos']).then(() => window.location.reload()); } //montar pedido
  confirmedProducts() { this.router.navigate(['/menu/confirmed-products']).then(() => window.location.reload()); }//pedidos confirmados
  pedidosFinalizados() { this.router.navigate(['/menu/finished-products']).then(() => window.location.reload()); }//pedidos finalizados
  //Peticiones
  realizarPeticion() { this.router.navigate(['/menu/add-information']).then(() => window.location.reload()); }//realizar peticion
  peticionesRealizadas() { this.router.navigate(['/menu/view-peticiones']).then(() => window.location.reload()); }//peticiones realizadas
  historialPeticiones() { this.router.navigate(['/menu/historial-peticiones']).then(() => window.location.reload()); }//historial de peticiones
  //Historial
  historialDocumentos() { this.router.navigate(['**']).then(() => window.location.reload()); }//historial de documentos excel y pdf
  //Configuraciones
  crearUsuario() { this.router.navigate(['/menu/usuarios']).then(() => window.location.reload()); }//crear usuario
  cambiarContrasena() { this.router.navigate(['**']).then(() => window.location.reload()); }//cambiar contraseña
}
