import { Component } from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import { Router } from '@angular/router';
@Component({
  selector: 'app-home-pharma',
  templateUrl: './home-pharma.component.html',
  styleUrls: ['./home-pharma.component.css'],
})
export class HomePharmaComponent {

constructor(private router:Router){}

rutaRegister(){
  this.router.navigate(['/register']);
}
rutaLogin(){
  this.router.navigate(['/prueba-login']);
}
}
