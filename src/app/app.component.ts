import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'PharmaSALES.PA';
  showRegister: boolean = false; // Inicialmente oculto
  showChangePassword: boolean = false; // Inicialmente oculto
  constructor(private router: Router) {}

  ngOnInit() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // Verificar la ruta actual y decidir si mostrar el login o no
        this.showRegister = event.url === '/register';
        this.showChangePassword = event.url === '/cambio-contrasena';
      }
    });
  }
}
