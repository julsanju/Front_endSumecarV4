import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { UsuariosView } from 'src/app/Interfaces/usuarios-view';
import { UsuariosServicesService } from 'src/app/services/usuarios-services.service';
import { Page404Component } from '../page404/page404.component';
import { AuthService } from 'src/app/services/auth.service';

//enumeracion
enum PageConfiguration {
  EditarPerfil,
  ModificarContrasena,
  Apariencia
}

@Component({
  selector: 'app-configuracion',
  standalone: true,
  imports: [HttpClientModule, NzLayoutModule, CommonModule, Page404Component],
  templateUrl: './configuracion.component.html',
  styleUrl: './configuracion.component.css'
})
export class ConfiguracionComponent {
  //variables para autenticacion
  userAuth:any = '';
  foto: any = '';
  telefono: any = '';
  email: any = '';
  userVerified:any = '';
  //variable para decidir si mostraremos los usuarios de bd o de authGoogle
  bool!: boolean;
  //loading
  cargando:boolean = false;
  //datos para mapear
  dataMapeo: UsuariosView[] = [];
  imagenUser: string = "";
  //opcion del menu
  pageConfiguration: PageConfiguration = PageConfiguration.EditarPerfil
  constructor(private servicio: UsuariosServicesService, private auth: AuthService){}

  ngOnInit(){
    this.obtenerUsuario();
    this.validateDataProfileAuth();
    this.mapeoUserProfile();
  }


  obtenerUsuario() {
    
    this.foto = localStorage.getItem('photoURL');
    this.userAuth = localStorage.getItem('nombre');
    this.email = localStorage.getItem('email');
    const capsuleVerified =  localStorage.getItem('userVerified');
    this.userVerified = Boolean(capsuleVerified);
    
}
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

  // cerrar sesion
  logout() {
    this.auth.logOut()
  }
  mostrarEditarPerfil(){
    this.pageConfiguration = PageConfiguration.EditarPerfil
  }
  mostrarModificarContrasena() {
    this.pageConfiguration = PageConfiguration.ModificarContrasena
  }

  mostrarApariencia(){
    this.pageConfiguration = PageConfiguration.Apariencia
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
}
