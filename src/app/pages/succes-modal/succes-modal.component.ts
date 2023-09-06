import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-succes-modal',
  templateUrl: './succes-modal.component.html',
  styleUrls: ['./succes-modal.component.css']
})
export class SuccesModalComponent {
  @Input() modalClass: string = '';
  constructor(public activeModal: NgbActiveModal) {}
}
