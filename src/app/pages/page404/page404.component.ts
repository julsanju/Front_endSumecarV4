import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-page404',
  templateUrl: './page404.component.html',
  styleUrls: ['./page404.component.css']
})
export class Page404Component {
  
  constructor(private router:Router){}
  regresar(){
    this.router.navigate(['/prueba-login']);
  }

}
