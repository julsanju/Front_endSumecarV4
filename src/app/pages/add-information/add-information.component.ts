import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Correo } from 'src/app/Interfaces/correo';
import { EnvioCorreosService } from 'src/app/services/envio-correos.service';

@Component({
  selector: 'app-add-information',
  templateUrl: './add-information.component.html',
  styleUrls: ['./add-information.component.css']
})
export class AddInformationComponent {
  username = '';
  formulario: FormGroup;
  //formularioEnviado = false;

  constructor(private formBuilder: FormBuilder, private peticion: EnvioCorreosService) {
    this.formulario = this.formBuilder.group({
      correo: ['', [ Validators.required]],
      mensaje : ['', [Validators.required]],
      usuario : ['', [Validators.required]]
    });
  }

  

  onSubmit() {
    const userDataString = localStorage.getItem('userData');
    const data : Correo = this.formulario.value
    
    if (userDataString) {
      try {
        // Intenta analizar la cadena como JSON
        const userData = JSON.parse(userDataString);
        this.username = userData.usuario; // Actualiza la propiedad 'username' con el valor correcto

      } catch (error) {
        // En caso de un error al analizar JSON, puedes manejarlo o simplemente retornar false
        console.error('Error al analizar JSON:', error);
      }
    
    
    
    this.peticion.addPeticion(data, this.username,).subscribe(
      response => {
        console.log(response);
        console.log("Registro exitoso");
      },
      error => {
        console.error("Error:", error);
        console.log(error.error)
        console.log("Error en el registro" + " "+data.correo );
      },
    );
    }
    
    
  }
}
