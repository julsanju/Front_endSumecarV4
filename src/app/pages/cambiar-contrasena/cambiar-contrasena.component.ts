import { Component, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SharedServicesService } from '../../services/shared-services.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalMessageComponent } from '../modal-message/modal-message.component';
import { MensajeError } from '../../Interfaces/mensaje-error';
import { Login } from 'src/app/Interfaces/login';
import { LoginServicesService } from 'src/app/services/login-services.service';
import { MatStepper } from '@angular/material/stepper';
import { Contrasena } from 'src/app/Interfaces/contrasena';
import { RouterModule, RouterOutlet } from '@angular/router';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatStepperModule } from '@angular/material/stepper';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSortModule } from '@angular/material/sort';
import {MatInputModule} from '@angular/material/input';
import {MatExpansionModule} from '@angular/material/expansion';
import { MatDialogModule } from '@angular/material/dialog';
import { MatGridListModule } from '@angular/material/grid-list';
import {MatCardModule} from '@angular/material/card';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-cambiar-contrasena',
  standalone: true,
  imports: [
    HttpClientModule,
    RouterModule,
    MatPaginatorModule,
    ReactiveFormsModule,
    FormsModule,
    MatTableModule,
    MatProgressBarModule,
    MatStepperModule,
    MatSelectModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatSortModule,
    MatInputModule,
    MatExpansionModule,
    MatDialogModule,
    MatGridListModule,
    MatCardModule,
    RouterOutlet
],
  templateUrl: './cambiar-contrasena.component.html',
  styleUrls: ['./cambiar-contrasena.component.css']
})
export class CambiarContrasenaComponent {
  username = '';
  isEditable = false;
  errorMessage: MensajeError | null = null;
  usuario: string | null = null;
  datos : Login [] = [];
  step1Form!: FormGroup;
  step2Form!: FormGroup;
  step3Form!: FormGroup;
  step4Form!: FormGroup;
  contrasenaForm !: FormGroup;
  mostrarAnimacion: boolean = false;
  desenfocarContenido: boolean = false;
  @ViewChild('stepper') stepper!: MatStepper;

  constructor(private fb: FormBuilder, 
    private dataShared:SharedServicesService, 
    private modalService: NgbModal,
    private  login:LoginServicesService,
    private renderer: Renderer2
    ) {
    this.initForms();
    this.mostrarData();

    this.contrasenaForm = this.fb.group({
      contrasena: ['', Validators.required],
      password: ['', Validators.required],

    });
  }

  mostrarData() {
    const nombre = localStorage.getItem('userData');
    
    if (nombre!== null) {
      const dato = JSON.parse(nombre); // Parse the JSON string into an object
      this.usuario = dato.usuario; // Set to null if the object or Usuario property is missing
        console.log(dato.usuario + '2');
      
    } else {
      this.usuario = null; // Handle the case where 'userData' is not found in localStorage
      
    }

    
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
  
  

  onSubmit(){
    const modalRef = this.modalService.open(ModalMessageComponent, {
      size: "sm", // Puedes ajustar el tamaño del modal aquí según tus necesidades
    });
    modalRef.componentInstance.modalClass = "succes-modal"; // Establece la clase CSS del modal
    this.errorMessage = null; 
  }

 
  
  openModal() {
    // Abre el modal
    const modalRef = this.modalService.open(ModalMessageComponent, { size: 'sm' });

    // Activa el desenfoque del contenido del componente del modal
    this.desenfocarContenido = true;

    // Escucha el evento de cierre del modal
    modalRef.result.then(
      (result) => {
        // Cuando se cierra el modal, desactiva el desenfoque del contenido
        this.desenfocarContenido = false;
      },
      (reason) => {
        // También puedes manejar una razón específica si es necesario
        this.desenfocarContenido = false;
      }
    );
    
  }
  

  //metodo para poder enviar peticion al correo 
  peticionCorreo(){
    const userDataString = localStorage.getItem('userData');

    if (userDataString) {
      try {
        // Intenta analizar la cadena como JSON
        const userData = JSON.parse(userDataString);
        this.username = userData.usuario; // Actualiza la propiedad 'username' con el valor correcto

      } catch (error) {
        // En caso de un error al analizar JSON, puedes manejarlo o simplemente retornar false
        console.error('Error al analizar JSON:', error);
      }
    }

    this.login.peticionCorreo(this.username).subscribe(
      response => {
        console.log(response);
        console.log("Registro exitoso");
      },
      error => {
        console.error("Error:", error);
        console.log(error.error)
        console.log("Error en el registro");
      },
    )
  }
  
//metodo para poder validar el estado de la peticion
  validarEstado(){
    const data = localStorage.getItem('userData');

    if (data) {
          try {
            // Intenta analizar la cadena como JSON
            const userData = JSON.parse(data);
            this.username = userData.usuario; // Actualiza la propiedad 'username' con el valor correcto

          } catch (error) {
            // En caso de un error al analizar JSON, puedes manejarlo o simplemente retornar false
            console.error('Error al analizar JSON:', error);
          }
        }

        this.login.ValidarEstado(this.username).subscribe(
          response => {
            console.log(response);
            console.log("Registro exitoso");
            this.avanzarPaso();
          },
          error => {
            console.error("Error:", error);
            console.log(error.error)
            console.log("Error en el registro");
          },
        )

  }

  //metodo para avanzar si el paso fue exitoso
  avanzarPaso() {
    // Avanza al siguiente paso del stepper
    this.stepper.next();
  }
  
  //metodo para poder cambiar contraseña
  Cambiarcontrasena(){
    const username = localStorage.getItem('userData');
    const data: Contrasena = this.contrasenaForm.value;

    if (username) {
          try {
            // Intenta analizar la cadena como JSON
            const userData = JSON.parse(username);
            this.username = userData.usuario; // Actualiza la propiedad 'username' con el valor correcto

          } catch (error) {
            // En caso de un error al analizar JSON, puedes manejarlo o simplemente retornar false
            console.error('Error al analizar JSON:', error);
          }
        }

    this.login.CambiarContrasena(data, this.username).subscribe(
      response => {
        console.log(response)
        this.avanzarPaso();
      },
      error => {
        console.log(error)
      }
    )

  }
  
}
