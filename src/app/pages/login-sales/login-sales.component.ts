import { Component} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginServicesService } from '../../services/login-services.service';
import { Login } from '../../Interfaces/login';
import { MensajeError } from '../../Interfaces/mensaje-error';
@Component({
  selector: 'app-login-sales',
  templateUrl: './login-sales.component.html',
  styleUrls: ['./login-sales.component.css']
})

export class LoginSalesComponent {
  errorMessage: MensajeError | null = null;
  loginForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private loginService: LoginServicesService) {
    this.loginForm = this.formBuilder.group({
      Usuario: ['', Validators.required],
      Contrasena: ['', Validators.required],
      Rol: ['', Validators.required]
    });
  }

  onSubmit() {
    const userData: Login = this.loginForm.value;

    this.loginService.LoginValidation(userData).subscribe(
      response => {
        console.log(response);
        console.log("Login exitoso");
        this.errorMessage = null; // Limpiar el mensaje de error si hubo éxito
      },
      error => {
        console.error("Error:", error);
        this.errorMessage = error; // Guardar el mensaje de error en la variable errorMessage
        console.log(this.errorMessage);
      }
    );
  }
}
