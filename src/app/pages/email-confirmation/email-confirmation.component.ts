import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppComponent } from 'src/app/app.component';

enum State {
  DataConfirmation,
  FailedEmail,
  SuccesEmail
}

@Component({
  selector: 'app-email-confirmation',
  standalone: true,
  imports: [],
  templateUrl: './email-confirmation.component.html',
  styleUrl: './email-confirmation.component.css'
})
export class EmailConfirmationComponent implements OnInit{
  cargando:boolean = false;
  succes:boolean = false;
  state : State = State.DataConfirmation
  usuario: string = '';
  token: string = '';

  constructor(private app: AppComponent, private route: ActivatedRoute, private http: HttpClient){
    this.app.mostrarMenu = false;
  }

  ngOnInit(): void {
    this.usuario = this.route.snapshot.queryParams['usuario'];
    this.token = this.route.snapshot.queryParams['token'];

    console.log(this.usuario, this.token)
  }

  validateEmail() {
    this.http.get<any>(`http://localhost:5171/api/login/validar_correo?usuario=${this.usuario}&token=${this.token}`)
      .subscribe(
        (response) => {
          this.state = State.SuccesEmail
          // Manejar la respuesta exitosa
          console.log(response);
        },
        (error) => {
          this.state = State.FailedEmail
          // Manejar el error
          console.error(error);
        }
      );
  }
  windowClose(){
    this.cargando = true
    setTimeout(() => {
      this.cargando = false;
      window.close()
    }, 1000);
  }
}
