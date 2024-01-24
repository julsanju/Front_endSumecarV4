import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
import { DepartamentoCiudad } from 'src/app/Interfaces/departamento-ciudad';
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
  //variables para departamentos y ciudades
  departamentos: DepartamentoCiudad[] = [];
  ciudades: DepartamentoCiudad[] = [];
  //imagenes
  @ViewChild('fileInput') fileInput: ElementRef | undefined;
  selectedImages: string[] = [];
  formData: FormData;

  constructor(private servicioUsuarios: UsuariosServicesService,
    private formBuilder: FormBuilder,
    private registerService: RegisterService,
    private messageService: MessageService) {

    this.formData = new FormData()

    this.registrationForm = this.formBuilder.group({
      Identificacion: ['', Validators.required],
      Rol: ['', Validators.required],
      Nombre: ['', Validators.required],
      Ubicacion: ['', Validators.required],
      Telefono: ['', Validators.required],
      Correo: ['', [Validators.required, Validators.email]],
      Usuario: ['', Validators.required],
      Contrasena: ['', Validators.required],
      Departamento: ['', Validators.required],
      Ciudad: ['', Validators.required],
      Imagen: [null]
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
    // Llamada al servicio para obtener los datos de empleados
    this.servicioUsuarios.obtenerEmpleado().subscribe(
      (response) => {
        this.dataSource = response;
        this.originalDataSource = response;
      },
      error => {
        console.error('Error obteniendo datos', error);
      }
    );

    //lamada al servicio para obtener departamentos
    this.servicioUsuarios.obtenerDepartamento().subscribe(
      (response) => {
        this.departamentos = response;
        console.log(this.departamentos)
      },
      (error) => {
        console.error('Error obteniendo departamentos', error);
      }
    );

    this.mostrarCiudad()


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

  //imagenes
  onFileChange(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const files = inputElement.files;

    if (files && files.length > 0) {
      this.selectedImages = [];
      this.formData = new FormData();

      for (let i = 0; i < files.length; i++) {
        const reader = new FileReader();

        reader.onload = (e: any) => {
          this.selectedImages.push(e.target.result);
        };

        reader.readAsDataURL(files[i]);

        this.formData.append('image', files[i], files[i].name);
      }
    }
  }


  clearSelection() {
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
    this.selectedImages = [];
  }
  //subcribirse a los cambios para ciudad mediante a codigo de departamento
  mostrarCiudad() {
    this.registrationForm.get('Departamento')?.valueChanges.subscribe((codigoDepartamento) => {
      // Obtener ciudades basadas en el departamento seleccionado
      this.servicioUsuarios.obtenerCiudad(codigoDepartamento).subscribe(
        (data) => {
          this.ciudades = data;
          console.log(this.ciudades)

        },
        (error) => {
          console.error('Error obteniendo ciudades', error);
        }
      );
    });
  }

  //metodo para crear un nuevo usuario
  /*crearUsuario() {
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

  }*/

  crearUsuario() {
    this.cargando = true;

    const imagen = this.registrationForm.get('Imagen')!.value;
    //const userData: Usuarios = this.registrationForm.value;
    
      const formData = new FormData();
      //mapeo
      formData.append('Nombre', this.registrationForm.value.Nombre);
      formData.append('Contrasena', this.registrationForm.value.Contrasena);
      formData.append('ImagenUrl',this.registrationForm.value.Imagen);
      formData.append('Identificacion', this.registrationForm.value.Identificacion);
      formData.append('Rol', this.registrationForm.value.Rol);
      formData.append('Ubicacion', this.registrationForm.value.Ubicacion);
      formData.append('Telefono', this.registrationForm.value.Telefono);
      formData.append('Correo', this.registrationForm.value.Correo);
      formData.append('Usuario', this.registrationForm.value.Usuario);
      formData.append('Contrasena', this.registrationForm.value.Contrasena);
      formData.append('Usuario', this.registrationForm.value.Usuario);
      formData.append('Departamento', this.registrationForm.value.Departamento);
      formData.append('Ciudad', this.registrationForm.value.Ciudad);

      // Llamada al servicio para registrar al usuario
      if (this.registrationForm.valid) {
        if (this.registrationForm.get('Correo')?.hasError('invalidEmail')) {
          this.errorMessage = { Message: "Formato incorrecto para el correo electronico." };
          this.mostrarDanger();
          this.cargando = false
        }
        else {


          console.log(formData);
          /*this.registerService.registerUser(formData).subscribe(
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
  
          );*/
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
