import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';



@Component({
  selector: 'app-cambiar-contrasena',
  templateUrl: './cambiar-contrasena.component.html',
  styleUrls: ['./cambiar-contrasena.component.css']
})
export class CambiarContrasenaComponent {

  userForm!: FormGroup;
  doctorForm!: FormGroup;

constructor(private fb: FormBuilder) {
  this.initForms();
}


/* JS del primer punto, cambiar "Cambiar tus Datos" */

initForms() { /* Esto es del primer punto, si quieres copiate */
  this.userForm = this.fb.group({
    email: ['', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]],
    firstName: ['', [Validators.required, Validators.minLength(5)]],
    /* lastName: ['', [Validators.required, Validators.minLength(5)]] */
  });

  this.doctorForm = this.fb.group({
    especialidad: ['', [Validators.required, Validators.minLength(5)]],
    licenciaProfesional: ['', [Validators.required, Validators.minLength(5)]],
    universidad: ['', [Validators.required, Validators.minLength(5)]],
  });
}

get invalidFirstname() {
  return this.userForm?.get('firstName')?.invalid && this.userForm?.get('firstName')?.touched;
}

get invalidLastname() {
  return this.userForm.get('lastName')?.invalid && this.userForm.get('lastName')?.touched;
}

get invalidEmail() {
  return this.userForm.get('email')?.invalid && this.userForm.get('email')?.touched;
}
}