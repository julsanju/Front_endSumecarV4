import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { LoginServicesService } from 'src/app/services/login-services.service';

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

  constructor(private app: AppComponent, private route: ActivatedRoute, private http: HttpClient, private loginService: LoginServicesService){
    this.app.mostrarMenu = false;
  }

  ngOnInit(): void {
    this.usuario = this.route.snapshot.queryParams['usuario'];
    this.token = this.route.snapshot.queryParams['token'];

    console.log(this.usuario, this.token)
  }

  validateEmail() {
    this.http.get<any>(`http://192.168.0.51:5000/api/login/validar_correo?usuario=${this.usuario}&token=${this.token}`)
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

  //metodo para cancelar la peticion de confirmar correo
  declineEmailConfirmation(){
    this.cargando = true
    this.loginService.declineEmail_Confirmation(this.usuario).subscribe(
      (response) => {
        setTimeout(() => {
          this.cargando = false;
          window.close()
        }, 1000);
        console.log(response)
      },
      (error) => {
        setTimeout(() => {
          this.cargando = false;
          window.close()
        }, 1000);
        console.error("el error es: " + error.message)
      }
    )
  }
  windowClose(){
    this.cargando = true
    setTimeout(() => {
      this.cargando = false;
      window.close()
    }, 1000);
  }
}
