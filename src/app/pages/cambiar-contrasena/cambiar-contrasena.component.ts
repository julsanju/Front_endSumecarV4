import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-cambiar-contrasena',
  templateUrl: './cambiar-contrasena.component.html',
  styleUrls: ['./cambiar-contrasena.component.css']
})
export class CambiarContrasenaComponent {
  step1Form!: FormGroup;
  step2Form!: FormGroup;
  step3Form!: FormGroup;
  step4Form!: FormGroup;

  constructor(private fb: FormBuilder) {
    this.initForms();
  }

  initForms() {
    this.step1Form = this.fb.group({
      email: ['', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,3}$')]],
      firstName: ['', [Validators.required, Validators.minLength(5)]],
    });

    this.step2Form = this.fb.group({
      // Definir campos para el segundo paso
    });

    this.step3Form = this.fb.group({
      // Definir campos para el tercer paso
    });

    this.step4Form = this.fb.group({
      // Definir campos para el cuarto paso
    });
  }

  get invalidFirstname() {
    return this.step1Form?.get('firstName')?.invalid && this.step1Form?.get('firstName')?.touched;
  }

  get invalidEmail() {
    return this.step1Form?.get('email')?.invalid && this.step1Form?.get('email')?.touched;
  }

  // Agregar getters similares para los otros formularios si es necesario
}
