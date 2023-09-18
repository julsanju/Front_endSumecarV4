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
  
}
