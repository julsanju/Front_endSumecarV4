import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
//import { json } from 'node:stream/consumers';
import { LoginServicesService } from 'src/app/services/login-services.service';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { HttpClientModule } from '@angular/common/http';

import { UsuariosServicesService } from 'src/app/services/usuarios-services.service';
import { CommonModule } from '@angular/common';
import { UsuariosView } from 'src/app/Interfaces/usuarios-view';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [HttpClientModule, RouterModule, NzLayoutModule, CommonModule],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent {
  isCollapsed = false;
  isAdmin = false;
  isEmpleado = false;
  isCliente = false;
  username: string = '';
  rol: string = '';
  defaultImagen: string = "";
  imagenUser: string = "";
  /*animaciones sidebar*/
  rotacionProductos = false;
  rotacionPeticiones = false;
  rotacionHistorial = false;
  rotacionConfiguracion = false;
  //datos para mapear
  dataMapeo: UsuariosView[] = [];
  //loading
  cargando:boolean = false;

  constructor(private login: LoginServicesService, private router: Router, private servicio: UsuariosServicesService) { }
  breadcrumbs: string[] = [];
  ngOnInit() {
    this.mapeoUserProfile();
    // Recupera la información del usuario desde localStorage
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

  productos() {
    this.router.navigate(['/menu/productos']).then(() => window.location.reload());
  }

  //metodo para mapear datos en el userProfile
  mapeoUserProfile() {
    this.cargando = true;
    const userDataString = localStorage.getItem('userData');
    if (userDataString) {
      const userData = JSON.parse(userDataString);

      // Extraer solo el id de usuario
      const username = userData.usuario;

      this.servicio.obtenerMapeo(username).subscribe(
        (response) => {
          this.cargando = false
          this.dataMapeo = (response)
          this.obtenerImagenUser()
        },
        (error) => {
          this.cargando = false
          console.error('Error al obtener la imagen:', error);
        }
      );
    }
    return false;
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

  

  obtenerImagenUser() {
    const userDataString = localStorage.getItem('userData');
    if (userDataString) {
      const userData = JSON.parse(userDataString);

      // Extraer solo el id de usuario
      const username = userData.usuario;
      this.servicio.obtenerImagenUser(username).subscribe(
        (response) => {
          if (!response || response === '') {
            this.dataMapeo.forEach(element => {
              if (element.sexo === 'F') {
                this.imagenUser = 'https://i.postimg.cc/7hkDGkfy/woman-1.png';
              } else if (element.sexo === 'M') {
                this.imagenUser = 'https://i.postimg.cc/v87D7Qfj/boy.png';
              }
                else if (element.sexo === 'Otro') {
                this.imagenUser = 'https://i.postimg.cc/fy36WWcK/who.png';
              }
            });
          } else {
            this.imagenUser = response;
          }
        },
        (error) => {
          this.dataMapeo.forEach(element => {
            if (element.sexo === 'F') {
              this.imagenUser = 'https://i.postimg.cc/7hkDGkfy/woman-1.png';
            }
            if (element.sexo === 'M') {
              this.imagenUser = 'https://i.postimg.cc/v87D7Qfj/boy.png';
            }
            if (element.sexo === 'Otro') {
              this.imagenUser = 'https://i.postimg.cc/fy36WWcK/who.png';
            }
          });
          
          console.error('Error al obtener la imagen:', error);
        }
      );
    }
    return false;
  }

  toggleProductos() {
    this.rotacionProductos = !this.rotacionProductos;
  }

  togglePeticiones() {
    this.rotacionPeticiones = !this.rotacionPeticiones;
  }

  toggleHistorial() {
    this.rotacionHistorial = !this.rotacionHistorial;
  }

  toggleConfiguracion() {
    this.rotacionConfiguracion = !this.rotacionConfiguracion;
  }
}
