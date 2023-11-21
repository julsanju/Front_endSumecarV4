import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Correo } from 'src/app/Interfaces/correo';
import { EnvioCorreosService } from 'src/app/services/envio-correos.service';
import { UsuariosServicesService } from 'src/app/services/usuarios-services.service';
import { MensajeError } from 'src/app/Interfaces/mensaje-error';
import { Empleado } from 'src/app/Interfaces/empleado';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-add-information',
  templateUrl: './add-information.component.html',
  styleUrls: ['./add-information.component.css']
})
export class AddInformationComponent implements OnInit{
  username = '';
  correo = '';
  data !: Empleado
  formulario: FormGroup;
  usuarioSeleccionadoEmail: string = '';
  spinner: boolean = false;
  errorMessage: MensajeError | null = null;
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
        this.spinner = false;

        Swal.fire('Peticion enviada correctamente', '', 'success');
      },
      error => {
        this.spinner = false;

        this.errorMessage = error.Message; // Accede al campo "Message" del JSON de error
        console.log(this.errorMessage);

        Swal.fire({
          title: 'ERROR',
          html: `${this.errorMessage}`,
          icon: 'error',
        });
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
            value: empleado.correo, 
            viewValue: empleado.nombre 
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
  
    // Actualiza el correo electrónico en el control del formulario
    this.formulario.get('correo')?.setValue(selectedUserValue);
  
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
