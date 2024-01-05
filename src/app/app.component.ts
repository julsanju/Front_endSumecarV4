
import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { initFlowbite } from 'flowbite';
import { LoginServicesService } from './services/login-services.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HttpClientModule],
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
  constructor(private login: LoginServicesService, private router: Router) {}

  ngOnInit(): void {
    initFlowbite();

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

  esEmpleado(): boolean{
    const userDataString = localStorage.getItem('userData');
    if (userDataString) {
      try{
        const userData = JSON.parse(userDataString);
        return userData.rol === 'empleado';
      }catch (error) {
        console.error('Error al aalizar JSON:' , error)
        return false;
      }
    }
    return false;

  }

  esCliente(): boolean{
    const userDataString = localStorage.getItem('userData');
    if (userDataString) {
      try{
        const userData = JSON.parse(userDataString);
        return userData.rol === 'cliente';
      }catch (error) {
        console.error('Error al aalizar JSON:' , error)
        return false;
      }
    }
    return false;
  }

  //**Redirecciones**

  //Home
  home(){ this.router.navigate(['/menu/dashboard']);}
  //Productos
  montarPedido(){ this.router.navigate(['/menu/productos']); } //montar pedido
  confirmedProducts(){this.router.navigate(['/menu/confirmed-products']);}//pedidos confirmados
  pedidosFinalizados(){this.router.navigate(['/menu/finished-products']);}//pedidos finalizados
  //Peticiones
  realizarPeticion(){this.router.navigate(['/menu/add-information']);}//realizar peticion
  peticionesRealizadas(){this.router.navigate(['/menu/view-peticiones']);}//peticiones realizadas
  historialPeticiones(){this.router.navigate(['/menu/historial-peticiones']);}//historial de peticiones
  //Historial
  historialDocumentos(){this.router.navigate(['**']);}//historial de documentos excel y pdf
  //Configuraciones
  crearUsuario(){this.router.navigate(['/menu/usuarios']);}//crear usuario
  cambiarContrasena(){this.router.navigate(['/menu/cambiar-contrasena']);}//cambiar contraseña
}
