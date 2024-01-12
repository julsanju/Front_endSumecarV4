import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Empleado } from 'src/app/Interfaces/empleado';
import { MensajeError } from 'src/app/Interfaces/mensaje-error';
import { Usuarios } from 'src/app/Interfaces/usuarios';
import { UsuariosView } from 'src/app/Interfaces/usuarios-view';
import { NumbersOnlyDirective } from 'src/app/directives/numbers-only.directive';
import { RegisterService } from 'src/app/services/register.service';
import { UsuariosServicesService } from 'src/app/services/usuarios-services.service';
import { MessageService } from 'primeng/api';
import { Toast, ToastModule } from 'primeng/toast';
import { HttpClientModule } from '@angular/common/http';
@Component({
  selector: 'app-crear-usuario',
  standalone: true,
  imports: [HttpClientModule, ReactiveFormsModule, CommonModule],
  providers: [MessageService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './crear-usuario.component.html',
  styleUrl: './crear-usuario.component.css'
})

export class CrearUsuarioComponent implements OnInit {
  registrationForm: FormGroup;
  UpdateForm: FormGroup;
  dataSource: Empleado[] = [];

  originalDataSource: Empleado[] = [];
  currentPage: number = 1;
  pageSize: number = 4;
  //loading
  cargando = false;
  //modal
  showAlert: boolean = false;
  showAlertDanger: boolean = false;
  showModal: boolean = false;
  errorMessage: MensajeError | null = null;
  //variables para los empleados y edicion de ellos
  empleadoSeleccionado: Empleado[] = [];
  empleadoEditar: Empleado[] = [];
  empleadoActual: Empleado | null = null;
  showToast = false;
  showEditar = false;

  constructor(private servicioUsuarios: UsuariosServicesService, private formBuilder: FormBuilder, private registerService: RegisterService, private messageService: MessageService) {
    this.registrationForm = this.formBuilder.group({
      Identificacion: ['', Validators.required],
      Rol: ['', Validators.required],
      Nombre: ['', Validators.required],
      Ubicacion: ['', Validators.required],
      Telefono: ['', Validators.required],
      Correo: ['', [Validators.required, Validators.email]],
      Usuario: ['', Validators.required],
      Contrasena: ['', Validators.required]
    });

    this.UpdateForm = this.formBuilder.group({
      Identificacion: ['', Validators.required],
      Rol: ['', Validators.required],
      Nombre: ['', Validators.required],
      Ubicacion: ['', Validators.required],
      Telefono: ['', Validators.required],
      Correo: ['', [Validators.required, Validators.email]],
      Usuario: ['', Validators.required],
      Contrasena: ['', Validators.required]
    })
  }

  ngOnInit(): void {
    // Llamada al servicio para obtener los datos

    this.servicioUsuarios.obtenerEmpleado().subscribe(
      (response) => {
        this.dataSource = response;
        this.originalDataSource = response;
      },
      error => {
        console.error('Error obteniendo datos', error);
      }
    );


  }

  getPaginatedData(): Empleado[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    return this.dataSource.slice(startIndex, endIndex);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
  }

  getEndIndex(): number {
    return Math.min(this.currentPage * this.pageSize, this.dataSource.length);
  }


  //tiempo para mostrar modal
  mostrarAlerta() {
    this.showAlert = true;

    setTimeout(() => {
      this.showAlert = false;
    }, 3000);

  }

  mostrarDanger() {
    this.showAlertDanger = true;

    setTimeout(() => {
      this.showAlertDanger = false;
    }, 3000);
  }

  mostrarEditAlerta() {
    this.showToast = true;

    setTimeout(() => {
      this.showToast = false;
    }, 3000);
  }


  //metodo para crear un nuevo usuario
  crearUsuario() {
    this.cargando = true;
    const userData: Usuarios = this.registrationForm.value;

    // Llamada al servicio para registrar al usuario
    if (this.registrationForm.valid) {
      if (this.registrationForm.get('Correo')?.hasError('invalidEmail')) {
        this.errorMessage = { Message: "Formato incorrecto para el correo electronico." };
        this.mostrarDanger();
        this.cargando = false
      }
      else {


        console.log(userData);
        this.registerService.registerUser(userData).subscribe(
          response => {
            console.log(response)
            this.mostrarAlerta();
            this.cargando = false
            this.registrationForm.reset();
          },
          error => {
            console.error("Error:", error);
            console.log(error.error)
            this.errorMessage = error.error;
            this.mostrarDanger();
            console.log(this.errorMessage?.Message);
            this.cargando = false;
          },

        );
      }
    }
    else {
      this.errorMessage = { Message: "Por favor, Asegúrese Completar todos los campos para finalizar el registro." };
      this.mostrarDanger();
      this.cargando = false
    }

  }

  //metodo para abrir el drawer que modificara los usuarios
  abrirModificarEmpleado() {
    this.showEditar = true;
  }

  //metodo para cerrar drawner de usuarios modificados
  cerrarModificarEmpleado() {
    this.showEditar = false;
  }

  //metodo para editar usuarios existentes
  EditarEmpleado() {

    this.cargando = true;
    const userData: Empleado = this.UpdateForm.value;

    // Llamada al servicio para registrar al usuario
    if (this.UpdateForm.valid) {
      if (this.UpdateForm.get('Correo')?.hasError('invalidEmail')) {
        this.errorMessage = { Message: "Formato incorrecto para el correo electronico." };
        this.mostrarDanger();
        this.cargando = false
      }
      else {

        this.registerService.ModificarEmpleado(userData)
          .subscribe(/*{
      next: () => {
        // Aquí resetear 
        this.UpdateForm.reset(); 
        this.mostrarAlerta();
        this.cerrar_modal();
        this.cargando = false;
      },*/
            response => {
              console.log(response)
              this.mostrarEditAlerta();
              this.cargando = false
              this.UpdateForm.reset();
              this.cerrarModificarEmpleado();
            },
            error => {
              console.error("Error:", error);
              console.log(error.error)
              this.errorMessage = error.error;
              this.mostrarDanger();
              console.log(this.errorMessage?.Message);
              this.cargando = false;
            },

          );
        /*console.log(userData);
        this.registerService.ModificarEmpleado(userData).subscribe(
          response => {
            console.log(response)
            this.mostrarAlerta();
            this.cerrar_modal();
            this.cargando = false
            this.registrationForm.reset();
          },
          error => {
            console.error("Error:", error);
            console.log(error.error)
            this.errorMessage = error.error;
            this.mostrarDanger();
            console.log(this.errorMessage?.Message);
            this.cargando = false;
          },

        );*/
      }
    }
    else {
      this.errorMessage = { Message: "Por favor, Asegúrese Completar todos los campos para finalizar el registro." };
      this.mostrarDanger();
      this.cargando = false
    }

  }

  show() {
    this.showToast = true;
  }

  EmpleadoSeleccionado(empleado: Empleado) {
    this.empleadoActual = Object.assign({}, empleado);
    this.empleadoSeleccionado.push(this.empleadoActual);

    this.UpdateForm.patchValue({
      Identificacion: this.empleadoActual.identificacion,
      Rol: this.empleadoActual.rol,
      Nombre: this.empleadoActual.nombre,
      Ubicacion: this.empleadoActual.ubicacion,
      Telefono: this.empleadoActual.telefono,
      Correo: this.empleadoActual.correo,
      Usuario: this.empleadoActual.usuario,
      Contrasena: this.empleadoActual.contrasena
    });

  }

  //objeto para animaciones de las alertas
  objectALertClasses(opacity_0: boolean, opacity_100: boolean, translate: boolean) {
    return {
      'opacity-0': opacity_0,
      'opacity-100': opacity_100,
      'transform translate-y-full': translate,
      'transition-transform ease-in-out duration-500': true,
      'transition-opacity ease-out duration-500': true
    }

  }

  //animacion alerta succes
  getSuccesAlertClasses() {
    return this.objectALertClasses(!this.showAlert, this.showAlert, !this.showAlert)
  }
  //animacion alerta danger
  getDangerAlertClasses() {
    return this.objectALertClasses(!this.showAlertDanger, this.showAlertDanger, !this.showAlertDanger)
  }
  //animacion alerta succes edit
  getEditAlertClasses() {
    return this.objectALertClasses(!this.showToast, this.showToast, !this.showToast)
  }


}
