import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login-aditional',
  standalone: true,
  imports: [],
  templateUrl: './login-aditional.component.html',
  styleUrl: './login-aditional.component.css'
})
export class LoginAditionalComponent implements OnInit {
  foto:any = ''

  ngOnInit(): void {
    this.obtenerImagen()
  }

  obtenerImagen(){
    this.foto = localStorage.getItem('photoURL');
  }
}
