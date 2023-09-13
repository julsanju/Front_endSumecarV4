import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SharedServicesService } from '../../services/shared-services.service';


@Component({
  selector: 'app-cambiar-contrasena',
  templateUrl: './cambiar-contrasena.component.html',
  styleUrls: ['./cambiar-contrasena.component.css']
})
export class CambiarContrasenaComponent {
  usuario: string | null = null;
  step1Form!: FormGroup;
  step2Form!: FormGroup;
  step3Form!: FormGroup;
  step4Form!: FormGroup;
  mostrarAnimacion: boolean = false;

  constructor(private fb: FormBuilder, private dataShared:SharedServicesService) {
    this.initForms();
    this.mostrarData();
  }

  mostrarData() {
    this.usuario = this.dataShared.usuario; // Obtener el usuario del servicio SharedDataServices
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

  activarAnimacion() {
    // Aquí puedes realizar cualquier lógica adicional si es necesario
    this.mostrarAnimacion = true; // Activa la animación
  }
  
  
  // Agregar getters similares para los otros formularios si es necesario
}
