import { Component} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginServicesService } from '../../services/login-services.service';
import { Login } from '../../Interfaces/login';
@Component({
  selector: 'app-login-sales',
  templateUrl: './login-sales.component.html',
  styleUrls: ['./login-sales.component.css']
})

export class LoginSalesComponent {

  loginForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private loginService: LoginServicesService) {
    this.loginForm = this.formBuilder.group({
      Usuario: ['', Validators.required],
      Contrasena: ['', Validators.required],
      Rol: ['', Validators.required]
    });
  }

  onSubmit() {
    //if (this.registrationForm.valid) {
      
      const userData: Login = this.loginForm.value;

      // Llamada al servicio para registrar al usuario
      this.loginService.LoginValidation(userData).subscribe(
        response => {
          console.log(response);
          console.log("login exitoso");
          
        },
        error => {
          console.error("Error:", error);
          console.log("Error en el login");
        }
      );
    //}
  }
}
