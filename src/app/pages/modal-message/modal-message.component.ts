import { Component, Input, Renderer2 } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-modal-message',
  templateUrl: './modal-message.component.html',
  styleUrls: ['./modal-message.component.css']
})
export class ModalMessageComponent {
  @Input() modalClass: string = '';
  @Input() desenfocarContenido: boolean = false;
  constructor(public activeModal: NgbActiveModal, private renderer: Renderer2) { }

  

activarDesenfoque() {
  this.desenfocarContenido = true; // Activa el desenfoque del contenido del modal
}

desactivarDesenfoque() {
  this.desenfocarContenido = false; // Desactiva el desenfoque del contenido del modal
}
  // Esta función se llama cuando se abre el modal
  /*openModal() {
    // Agregar clases al body y al modal para aplicar el desenfoque
    this.renderer.addClass(document.body, 'blur-background');
    this.renderer.addClass(document.body, 'modal-opened');
  }

  // Esta función se llama cuando se cierra el modal
  closeModal() {
    // Eliminar las clases del body y del modal para quitar el desenfoque
    this.renderer.removeClass(document.body, 'blur-background');
    this.renderer.removeClass(document.body, 'modal-opened');
  }*/
}
