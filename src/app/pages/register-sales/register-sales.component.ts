
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl  } from '@angular/forms';
import { RegisterService } from '../../services/register.service';
import { Usuarios } from '../../Interfaces/usuarios';
import {MatButtonModule} from '@angular/material/button';
import {MatStepperModule} from '@angular/material/stepper';
@Component({
  selector: 'app-register-sales',
  templateUrl: './register-sales.component.html',
  styleUrls: ['./register-sales.component.css']
})
export class RegisterSalesComponent {
  currentStep:number = 0;
  
  datosCompletos: boolean = false;
  isSelectActive: boolean = false;
  registrationForm: FormGroup;
  selectedValue: Usuarios[] | undefined;
  users = [
    {value: 'cliente', viewValue: 'Cliente'}
  ];

  cardStates = {
    card1: true,
    card2: true,
    card3: true
  };

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

  /*Eventos par el manejo de cards*/
  /*nextStep() {
    if (this.currentStep < 4) { // Cambiar a 4 si hay más pasos
      this.currentStep++;
    }
  }

  prevStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }*/

  nextStep() {
    if (this.currentStep < 4) { // Cambiar a 4 si hay más pasos
      this.currentStep++;
      this.closeCurrentCard(); // Cierra la card actual
    }
  }
  
  closeCurrentCard() {
    switch (this.currentStep) {
      case 2:
        this.cardStates.card1 = false;
        break;
      case 3:
        this.cardStates.card2 = false;
        break;
      case 4:
        this.cardStates.card3 = false;
        break;
    }
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

  toggleSelect() {
    this.isSelectActive = !this.isSelectActive;
  }

  
  
  
}

