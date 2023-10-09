import { Component, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SharedServicesService } from '../../services/shared-services.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalMessageComponent } from '../modal-message/modal-message.component';
import { MensajeError } from '../../Interfaces/mensaje-error';
import { Login } from 'src/app/Interfaces/login';
@Component({
  selector: 'app-cambiar-contrasena',
  templateUrl: './cambiar-contrasena.component.html',
  styleUrls: ['./cambiar-contrasena.component.css']
})
export class CambiarContrasenaComponent {
  isEditable = false;
  errorMessage: MensajeError | null = null;
  usuario: string | null = null;
  datos : Login [] = [];
  step1Form!: FormGroup;
  step2Form!: FormGroup;
  step3Form!: FormGroup;
  step4Form!: FormGroup;
  mostrarAnimacion: boolean = false;
  desenfocarContenido: boolean = false;

  constructor(private fb: FormBuilder, private dataShared:SharedServicesService, private modalService: NgbModal, private renderer: Renderer2) {
    this.initForms();
    this.mostrarData();
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
  
  
  
  
}
