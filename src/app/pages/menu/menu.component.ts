import { Component } from '@angular/core';
import { Router, NavigationEnd, ActivatedRouteSnapshot, UrlSegment   } from '@angular/router';
//import { json } from 'node:stream/consumers';
import { LoginServicesService } from 'src/app/services/login-services.service';

@Component({
  selector: 'app-menu',
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
  constructor(private login: LoginServicesService, private router: Router) {}
  breadcrumbs: string[] = [];
  ngOnInit() {
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
}
