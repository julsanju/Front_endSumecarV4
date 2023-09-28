import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';


@Component({
  selector: 'app-add-information',
  templateUrl: './add-information.component.html',
  styleUrls: ['./add-information.component.css']
})
export class AddInformationComponent {

  formulario: FormGroup;
  formularioEnviado = false;

  constructor(private formBuilder: FormBuilder) {
    this.formulario = this.formBuilder.group({
      email: ['', [ Validators.email]],
      mensaje : ['', [Validators.required]]
    });
  }

  onSubmit() {
    this.formularioEnviado = true;
    if (this.formulario.valid) {
      
      console.log('Datos válidos:', this.formulario.value);
    } else {
      
      console.log('Formulario no válido');
    }
  }
}
