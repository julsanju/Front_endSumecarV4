import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Contrasena } from 'src/app/Interfaces/contrasena';
import { DepartamentoCiudad } from 'src/app/Interfaces/departamento-ciudad';
import { MensajeError } from 'src/app/Interfaces/mensaje-error';
import { LoginServicesService } from 'src/app/services/login-services.service';

//enumeracion
enum State {
  sendEmail,
  waitingRoom,
  UpdatePassword
}

@Component({
  selector: 'app-modify-password',
  standalone: true,
  imports: [ReactiveFormsModule,
    CommonModule,
    RouterModule,
    HttpClientModule,
    FormsModule,],
  templateUrl: './modify-password.component.html',
  styleUrl: './modify-password.component.css'
})
export class ModifyPasswordComponent {

  passwordForm: FormGroup;
  errorMessage: MensajeError | null = null;
  showPreview: boolean = false;
  previewValue: string = '';
  previewDomain: string = 'gmail.com';
  previewVisible: boolean = false;
  estadoCard: boolean = false;

  showModalUpdate: boolean = false;
  DataCorreoUpdate: string = '';

  cargando = false;
  cargandoUpdatePassword: boolean = false;
  mostrarContrasena: boolean = false;
  departamentos: DepartamentoCiudad[] = [];
  ciudades: DepartamentoCiudad[] = [];
  showAlert: boolean = false;
  showAlertDanger: boolean = false;
  state: State = State.sendEmail

  @ViewChild('inputUpdatePassword') inputUpdatePassword!: ElementRef;
  constructor(private loginService: LoginServicesService, private cd: ChangeDetectorRef, private formBuilder: FormBuilder){
    this.passwordForm = this.formBuilder.group({
      contrasena: ['', Validators.required],
      password: ['', Validators.required]
    })
  }

  cerrarModalUpdate() {
    this.showModalUpdate = false;
  }

  declineUpdatePassword() {
    this.loginService.declineUpdate(this.DataCorreoUpdate).subscribe(
      (response) => {
        this.showModalUpdate = false;
        this.state = State.sendEmail;
        console.log("cancelado exitoso")
      },
      (error) => {
        console.error("el error es: " + error.message)
      }
    )
  }

  onInputChange(event: any) {
    const inputValue = event.target.value;
    const atIndex = inputValue.lastIndexOf('@');

    if (atIndex !== -1) {
      const username = inputValue.slice(0, atIndex);
      const domain = inputValue.slice(atIndex + 1);

      if (domain === '') {
        this.previewVisible = true;
        this.previewValue = `${username}@${this.previewDomain}`;
      } else if (domain === this.previewDomain) {
        this.previewVisible = true;
        this.previewValue = `${username}@${this.previewDomain}`;
      } else {
        this.previewVisible = false;
        this.previewValue = '';
      }
    } else {
      this.previewVisible = false;
      this.previewValue = '';
    }
  }

  onKeydown(event: any) {
    if (event.key === 'Tab') {
      event.preventDefault();
      event.target.value = this.previewValue;
      event.target.selectionStart = event.target.value.length;
      event.target.selectionEnd = event.target.value.length;
      this.previewVisible = false;
    }
  }

  mostrar_contrasena() {
    this.mostrarContrasena = !this.mostrarContrasena
  }
  // cambiar contraseña
  peticionCambioContrasena(correo: string) {
    this.cargandoUpdatePassword = true;
    this.DataCorreoUpdate = this.inputUpdatePassword.nativeElement.value;
    this.loginService.peticionCorreo(correo).subscribe(
      (response) => {
        this.state = State.waitingRoom;
        this.cd.detectChanges();
        this.cargandoUpdatePassword = false;
      },
      (error) => {
        this.cargandoUpdatePassword = false;
        this.errorMessage = error.error;
        this.mostrarDanger();
        console.error("el error es:" + error.message)
      }
    )
  }

  validateEstadoUpdate() {
    this.loginService.ValidarEstado(this.DataCorreoUpdate).subscribe(
      (response) => {
        console.log("ya valido");
        this.state = State.UpdatePassword;
        this.cd.detectChanges();
      },
      (error) => {
        console.error("El error es: " + error.message);
      }
    );
  }

  UpdatePassword() {
    this.cargandoUpdatePassword = true;
    const dataUpdatePassword: Contrasena = this.passwordForm.value;

    if (dataUpdatePassword != null) {
      this.loginService.CambiarContrasena(dataUpdatePassword, this.DataCorreoUpdate).subscribe(
        (response) => {
          this.cargandoUpdatePassword = false;
          console.log(response.message);
          this.cerrarModalUpdate();
          this.state = State.sendEmail;
        },
        (error) => {
          this.cargandoUpdatePassword = false;
          console.error("el error es :", error)
        }
      )
    }
    else {
      console.log("las contraseñas no coinciden")
    }
  }

  mostrarAlerta() {
    this.showAlert = true;

    setTimeout(() => {
      this.showAlert = false;
    }, 3000);

  }

  mostrarDanger() {
    this.showAlertDanger = true;

    setTimeout(() => {
      this.showAlertDanger = false;
    }, 3000);
  }
}
