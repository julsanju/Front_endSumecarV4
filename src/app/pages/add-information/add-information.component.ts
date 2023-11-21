import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Correo } from 'src/app/Interfaces/correo';
import { EnvioCorreosService } from 'src/app/services/envio-correos.service';
import { UsuariosServicesService } from 'src/app/services/usuarios-services.service';
import { Empleado } from 'src/app/Interfaces/empleado';
@Component({
  selector: 'app-add-information',
  templateUrl: './add-information.component.html',
  styleUrls: ['./add-information.component.css']
})
export class AddInformationComponent implements OnInit{
  username = '';
  data !: Empleado
  formulario: FormGroup;
  usuarioSeleccionadoEmail: string = '';
  //formularioEnviado = false;

  constructor(private formBuilder: FormBuilder, private peticion: EnvioCorreosService, private usurioService: UsuariosServicesService) {
    this.formulario = this.formBuilder.group({
      correo: ['', [ Validators.required]],
      mensaje : ['', [Validators.required]]
    });
  }

  
  ngOnInit(){
    this.llenarCombo();
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

  users: any[] = [];

  //llenar combobox
  llenarCombo() {
    // Llama al servicio para obtener los empleados
    this.usurioService.obtenerEmpleado().subscribe(
      (data: Empleado[]) => {
        // Mapea los datos obtenidos para adaptarlos al formato del array 'users'
        this.users = data.map((empleado: Empleado) => {
          return {
            value: empleado.correo, // Asegúrate de tener el campo correcto en tu modelo Empleado
            viewValue: empleado.nombre // Asegúrate de tener el campo correcto en tu modelo Empleado
          };
        });
      },
      error => {
        console.error('Error al obtener empleados: ', error);
      }
    );
  }


  onUserSelect(event: any) {
    const selectedUserValue = event.target.value;
  
    // Actualiza el correo electrónico en la propiedad usuarioSeleccionadoEmail
    this.usuarioSeleccionadoEmail = selectedUserValue;
  
    // Puedes acceder al servicio para obtener más detalles, incluido el correo electrónico
    this.usurioService.obtenerEmpleado().subscribe(
      (data: Empleado[]) => {
        const userDetails = data.find(user => user.correo === selectedUserValue);
        if (userDetails) {
          // Actualiza otros detalles del usuario si es necesario
          // Ejemplo: this.formulario.get('nombre').setValue(userDetails.nombre);
        }
      },
      error => {
        console.error('Error al obtener detalles del usuario: ', error);
      }
    );
  }

  updateEmail(email: string) {
    this.usuarioSeleccionadoEmail = email;
  }
  

}
