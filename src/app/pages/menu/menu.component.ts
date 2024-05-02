import { Component, booleanAttribute } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
//import { json } from 'node:stream/consumers';
import { LoginServicesService } from 'src/app/services/login-services.service';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { HttpClientModule } from '@angular/common/http';

import { UsuariosServicesService } from 'src/app/services/usuarios-services.service';
import { CommonModule } from '@angular/common';
import { UsuariosView } from 'src/app/Interfaces/usuarios-view';
import { AuthService } from 'src/app/services/auth.service';
import { FirebaseModule } from '../prueba-login/firebase/firebase.module';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [HttpClientModule, RouterModule, NzLayoutModule, CommonModule, FirebaseModule],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent {
  //variables para autenticacion
  userAuth:any = '';
  foto: any = '';
  telefono: any = '';
  email: any = '';
  userVerified:any = '';
  //variable para decidir si mostraremos los usuarios de bd o de authGoogle
  bool!: boolean;

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

  constructor(private login: LoginServicesService, 
    private router: Router, 
    private servicio: UsuariosServicesService,
    private auth: AuthService) { }
  breadcrumbs: string[] = [];
  ngOnInit() {
    // Recupera la información del usuario desde localStorage
    
    this.obtenerUsuario();
    this.validateDataProfileAuth();
    this.mapeoUserProfile();
    // const userDataString = localStorage.getItem('userData');
    // console.log(JSON.stringify(userDataString))
    // if (userDataString) {
    //   try {
    //     // Intenta analizar la cadena como JSON
    //     const userData = JSON.parse(userDataString);
    //     this.isAdmin = userData.Rol[0].RolId === '1';
    //     this.isEmpleado = userData.Rol[0].RolId === '2';
    //     this.username = userData.usuario; // Actualiza la propiedad 'username' con el valor correcto
    //     this.rol = userData.Rol[0].RolId;
    //   } catch (error) {
    //     // En caso de un error al analizar JSON, puedes manejarlo o simplemente retornar false
    //     console.error('Error al analizar JSON:', error);
    //   }
    // }

  }

  //validacion si llamaremos los usuarios de bd o de authGoogle
  validateDataProfileAuth(){
    const data = localStorage.getItem('bool');
    this.bool = data === 'false';
    if (data === 'true') {
      this.bool = Boolean(data);
    }
    if( data === 'false'){
      this.bool = Boolean(data?.toLowerCase() === 'true');
    }

  }

  productos() {
    this.router.navigate(['/menu/productos']).then(() => window.location.reload());
  }
  //redireccionar crear usuario
  redireccionarUsuario(){

    this.router.navigate(['/menu/usuarios']).then(() => window.location.reload());
  }

  //metodo para mapear datos en el userProfile
  mapeoUserProfile() {
    this.cargando = true;
    const userDataString = localStorage.getItem('userData');
    if (userDataString) {
      const userData = JSON.parse(userDataString);

      // Extraer solo el id de usuario
      const username = userData.Usuario;

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
        return userData.Rol[0].RolId === '1'; // Verifica la propiedad correcta 'rol'
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
        return userData.Rol[0].RolId === '2';
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
        return userData.Rol[0].RolId === '3';
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
      const username = userData.Usuario;
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

  //autenticacion
  logout() {
    this.auth.logOut()
  }

  obtenerUsuario() {
    
       this.foto = localStorage.getItem('photoURL');
       console.log(this.foto);
       this.userAuth = localStorage.getItem('nombre');
       this.email = localStorage.getItem('email');
       const capsuleVerified =  localStorage.getItem('userVerified');
       this.userVerified = Boolean(capsuleVerified);
       
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
