import { Component } from '@angular/core';
import { Router, NavigationEnd, ActivatedRouteSnapshot, RouterModule, ActivatedRoute } from '@angular/router';
//import { json } from 'node:stream/consumers';
import { LoginServicesService } from 'src/app/services/login-services.service';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzStepsModule } from 'ng-zorro-antd/steps';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzInputModule } from 'ng-zorro-antd/input'
import { HttpClientModule } from '@angular/common/http';

import { MatDialogModule } from '@angular/material/dialog';
import { UsuariosServicesService } from 'src/app/services/usuarios-services.service';
import { CommonModule } from '@angular/common';
import { UsuariosView } from 'src/app/Interfaces/usuarios-view';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [HttpClientModule, RouterModule, NzLayoutModule, NzMenuModule, NzBreadCrumbModule, MatDialogModule, NzStepsModule, NzSelectModule, NzInputModule, CommonModule],
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

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.breadcrumbs = this.createBreadcrumbs(this.router.routerState.snapshot.root); // Usa routerState.snapshot.root
      }
    });
  }

  productos() {
    this.router.navigate(['/menu/productos']).then(() => window.location.reload());
  }

  //metodo para mapear datos en el userProfile
  mapeoUserProfile() {
    const userDataString = localStorage.getItem('userData');
    if (userDataString) {
      const userData = JSON.parse(userDataString);

      // Extraer solo el id de usuario
      const username = userData.usuario;

      this.servicio.obtenerMapeo(username).subscribe(
        (response) => {
          this.dataMapeo = (response)
          this.obtenerImagenUserxd()
        },
        (error) => {
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

  //parte del breadcump
  private createBreadcrumbs(route: ActivatedRouteSnapshot, url: string = '', breadcrumbs: string[] = []): string[] {
    const children: ActivatedRouteSnapshot[] = route.children;

    if (children.length === 0) {
      return breadcrumbs;
    }

    for (const child of children) {
      const routeURL: string = child.url.map(segment => segment.path).join('/');
      if (routeURL !== '') {
        url += `${routeURL}`;
      }

      breadcrumbs.push(url);
      return this.createBreadcrumbs(child, url, breadcrumbs);
    }

    return breadcrumbs;
  }

  obtenerImagenUserxd() {
    const userDataString = localStorage.getItem('userData');
    if (userDataString) {
      const userData = JSON.parse(userDataString);

      // Extraer solo el id de usuario
      const username = userData.usuario;
      const sexo = this.dataMapeo[0].sexo;
      this.servicio.obtenerImagenUser(username).subscribe(
        (response) => {
            this.imagenUser = (response)
        },
        (error) => {
          this.dataMapeo.forEach(element => {
            if (element.sexo === 'F') {
              this.imagenUser = 'https://i.postimg.cc/c1tLBrHx/woman.png';
              console.log(element.sexo)
            }
            else if (element.sexo === 'M') {
              this.imagenUser = 'https://i.postimg.cc/VLXgf0p5/man-1.png';
              console.log(this.dataMapeo[0].sexo)
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
