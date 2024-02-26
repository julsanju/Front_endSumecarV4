import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';

@Component({
  selector: 'app-page404',
  templateUrl: './page404.component.html',
  styleUrls: ['./page404.component.css']
})
export class Page404Component {
  
  constructor(private router:Router, private app: AppComponent){this.app.mostrarMenu = false;}
  regresar(){
    this.router.navigate(['/prueba-login']);
  }

}
