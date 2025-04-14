import { Component } from '@angular/core';
import { UsuariosView } from 'src/app/Interfaces/usuarios-view';
import { AuthService } from 'src/app/services/auth.service';
import { UsuariosServicesService } from 'src/app/services/usuarios-services.service';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [],
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.css'
})
export class EditProfileComponent {
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
}
