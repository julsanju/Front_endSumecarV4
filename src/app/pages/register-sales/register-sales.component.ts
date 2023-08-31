
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RegisterService } from '../../services/register.service';
import { Usuarios } from '../../Interfaces/usuarios';

@Component({
  selector: 'app-register-sales',
  templateUrl: './register-sales.component.html',
  styleUrls: ['./register-sales.component.css']
})
export class RegisterSalesComponent {
  registrationForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private registerService: RegisterService) {
    this.registrationForm = this.formBuilder.group({
      Identificacion: ['', Validators.required],
      Rol: ['', Validators.required],
      Nombre: ['', Validators.required],
      Ubicacion: ['', Validators.required],
      Telefono: ['', Validators.required],
      Correo: ['', [Validators.required, Validators.email]],
      Usuario: ['', Validators.required],
      Contrasena: ['', Validators.required]
    });
  }

  onSubmit() {
    //if (this.registrationForm.valid) {
      const userData: Usuarios = this.registrationForm.value;

      // Llamada al servicio para registrar al usuario
      this.registerService.registerUser(userData).subscribe(
        response => {
          console.log(response);
          console.log("Registro exitoso");
        },
        error => {
          console.error("Error:", error);
          console.log(error.error)
          console.log("Error en el registro");
        },
        
      );
    //}
  }
}

