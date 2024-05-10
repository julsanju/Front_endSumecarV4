import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Empleado } from 'src/app/Interfaces/empleado';
import { MensajeError } from 'src/app/Interfaces/mensaje-error';
import { RegisterService } from 'src/app/services/register.service';
import { UsuariosServicesService } from 'src/app/services/usuarios-services.service';
import { MessageService } from 'primeng/api';
import { HttpClientModule } from '@angular/common/http';
import { DepartamentoCiudad } from 'src/app/Interfaces/departamento-ciudad';
import { forkJoin } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import { Usuariosxd } from 'src/app/Interfaces/usuariosxd';
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
  rolesToDisplay: string[] = ['admin', 'empleado', 'cliente'];
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
  //loading 
  isLoading: boolean = true;
  viewRol: boolean = false;
  usuarioRol:string = '';
  //variables para departamentos y ciudades
  departamentos: DepartamentoCiudad[] = [];
  ciudades: DepartamentoCiudad[] = [];
  //imagenes
  @ViewChild('fileInput') fileInput: ElementRef | undefined;
  selectedImages: string[] = [];
  formData: FormData;
  files: any = []

  //opciones derol
  opcionesSeleccionadas: any[] = [];
  xd: any[] = [];
  rolesChecked: boolean[] = [];
  checkedRoles: { RolId: number }[] = [];

  roles = [
    { label: 'Admin', value: 1, selected: false },
    { label: 'Empleado', value: 2, selected: false },
    { label: 'Cliente', value: 3, selected: false }
  ];

  constructor(private servicioUsuarios: UsuariosServicesService,
    private formBuilder: FormBuilder,
    private registerService: RegisterService,
    private messageService: MessageService,
    private sanitizer: DomSanitizer) {
    
    this.rolesChecked = new Array(this.rolesToDisplay.length).fill(false);
    this.formData = new FormData()

    this.registrationForm = this.formBuilder.group({
      Identificacion: ['', Validators.required],
      nit_empresa: ['', Validators.required],
      Rol: this.formBuilder.array([]),
      Nombre: ['', Validators.required],
      Apellido: ['', Validators.required],
      Sexo: ['', Validators.required],
      Ubicacion: ['', Validators.required],
      Telefono: ['', Validators.required],
      Correo: ['', [Validators.required, Validators.email]],
      Usuario: ['', Validators.required],
      Contrasena: ['', Validators.required],
      Departamento: ['', Validators.required],
      Ciudad: ['', Validators.required],
      //Imagen: ['']
    });

    this.UpdateForm = this.formBuilder.group({
      Identificacion: ['', Validators.required],
      rol: this.formBuilder.array([]),
      Nit_empresa: ['', Validators.required],
      Nombre: ['', Validators.required],
      Apellido: ['', Validators.required],
      Sexo: ['', Validators.required],
      Ubicacion: ['', Validators.required],
      Telefono: ['', Validators.required],
      Correo: ['', [Validators.required, Validators.email]],
      Usuario: ['', Validators.required],
      Contrasena: ['', Validators.required]
    })
  }

  toggleOption(option: any) {
    option.selected = !option.selected;
    if (option.selected) {
        this.opcionesSeleccionadas.push({ RolId: option.value });
    } else {
        // Buscar el índice del objeto en this.opcionesSeleccionadas que tenga el mismo RolId
        const index = this.opcionesSeleccionadas.findIndex((selectedOption: any) => selectedOption.RolId === option.value);
        if (index !== -1) {
            // Eliminar el objeto del arreglo this.opcionesSeleccionadas
            this.opcionesSeleccionadas.splice(index, 1);
        }
    }
    console.log('Opciones seleccionadas:', this.opcionesSeleccionadas);
}


  onCheckboxChange(index: number) {
    console.log("Checkbox index:", index);
  }

  updateCheckedRoles() {
    const numbersToCheck = [1, 2, 3]; // Numbers to check
    
    this.checkedRoles = [];
    this.rolesToDisplay.forEach((role, index) => {
        if (this.rolesChecked[index] && numbersToCheck.includes(index + 1)) {
            this.checkedRoles.push({ RolId: index + 1 }); // Push { RolId: index + 1 } into checkedRoles
        }
    });
    console.log("Checked roles:", this.checkedRoles);
    this.xd = this.checkedRoles
    console.log(this.xd)
}

  handleCheckboxChange(index: number) {
    this.rolesChecked[index] = !this.rolesChecked[index];
    this.updateCheckedRoles();
  }

  ngOnInit(): void {
    // Llamada al servicio para obtener los datos de empleados

    this.servicioUsuarios.obtenerEmpleado().subscribe(
      (response) => {
        this.dataSource = response;
        this.originalDataSource = response;
        this.isLoading = false;
      },
      error => {
        console.error('Error obteniendo datos', error);
      }
    );

    //lamada al servicio para obtener departamentos
    this.servicioUsuarios.obtenerDepartamento().subscribe(
      (response) => {
        this.departamentos = response;
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


  public onFileChange(event: any) {

    const imagen = event.target.files[0];
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

    if (imagen.type.startsWith('image/')) {
      this.files.push(imagen);
    } else {
      console.log('No es una imagen');
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
        },
        (error) => {
          console.error('Error obteniendo ciudades', error);
        }
      );
    });
  }

  blobFile = async ($event: any) =>
    new Promise((resolve, reject) => {
      try {
        if (!$event) {
          // Si $event es null, resolvemos la promesa con null
          resolve({
            blob: '',
            image: '',
            base: '',
          });
          return;
        } else {
          const unsafeImg = window.URL.createObjectURL($event);
          const image = this.sanitizer.bypassSecurityTrustUrl(unsafeImg);
          const reader = new FileReader();
          reader.readAsDataURL($event);
          reader.onload = () => {
            resolve({
              blob: $event,
              image,
              base: reader.result,
            });
          };
          reader.onerror = (error) => {
            resolve({
              blob: $event,
              image,
              base: null,
            });
          };
        }
      } catch (e) {
        reject(e);
      }
    });

  guardarxd() {
    const data = this.registrationForm.value as Usuariosxd;
    const rolesSeleccionados = this.registrationForm.get('Rol')?.value;

    data.Rol = this.opcionesSeleccionadas;
    const usuario = this.registrationForm.get('Usuario')?.value
    console.log(data)
    console.log(usuario)
    this.enviarFormulario(data, usuario);
  }
  // crearUsuario() {
  //   this.cargando = true;
  //   try {

  //     const formData = new FormData();
  //     // Verificar si hay archivos
  //     if (this.files.length === 0 || !Image) {
  //       console.log('No se proporcionaron imágenes.');
  //       formData.append('Nombre', this.registrationForm.value.Nombre);
  //       formData.append('Apellido', this.registrationForm.value.Apellido);
  //       formData.append('Sexo', this.registrationForm.value.Sexo);
  //       formData.append('Contrasena', this.registrationForm.value.Contrasena);
  //       formData.append('ImagenUrl', '');
  //       formData.append('Identificacion', this.registrationForm.value.Identificacion);
  //       formData.append('Rol', this.registrationForm.value.Rol);
  //       formData.append('Ubicacion', this.registrationForm.value.Ubicacion);
  //       formData.append('Telefono', this.registrationForm.value.Telefono);
  //       formData.append('Correo', this.registrationForm.value.Correo);
  //       formData.append('Usuario', this.registrationForm.value.Usuario);
  //       formData.append('Contrasena', this.registrationForm.value.Contrasena);
  //       formData.append('Departamento', this.registrationForm.value.Departamento);
  //       formData.append('Ciudad', this.registrationForm.value.Ciudad);
  //       // Continuar con el proceso sin agregar imágenes al formData
  //       this.enviarFormulario(formData, this.registrationForm.value.Usuario)

  //     }

  //     // Si hay archivos, cargar imágenes y enviar el formulario
  //     const imagesLoaded$ = forkJoin(this.files.map((item: File) => this.blobFile(item)));

  //     imagesLoaded$.subscribe(
  //       (images: any) => {

  //         formData.append('Nombre', this.registrationForm.value.Nombre);
  //         formData.append('Apellido', this.registrationForm.value.Apellido);
  //         formData.append('Sexo', this.registrationForm.value.Sexo);
  //         formData.append('Contrasena', this.registrationForm.value.Contrasena);

  //         images.forEach((image: any) => {
  //           // Agrega las imágenes al FormData
  //           if (image && image.blob) {
  //             formData.append('ImagenUrl', image.blob);
  //           }
  //         });

  //         formData.append('Identificacion', this.registrationForm.value.Identificacion);
  //         formData.append('Rol', this.registrationForm.value.Rol);
  //         formData.append('Ubicacion', this.registrationForm.value.Ubicacion);
  //         formData.append('Telefono', this.registrationForm.value.Telefono);
  //         formData.append('Correo', this.registrationForm.value.Correo);
  //         formData.append('Usuario', this.registrationForm.value.Usuario);
  //         formData.append('Contrasena', this.registrationForm.value.Contrasena);
  //         formData.append('Departamento', this.registrationForm.value.Departamento);
  //         formData.append('Ciudad', this.registrationForm.value.Ciudad);

  //         this.enviarFormulario(formData, this.registrationForm.value.Usuario);
  //         this.cargando = false;

  //       },
  //       (error) => {
  //         console.error('Error al cargar imágenes:', error);
  //         this.mostrarDanger();
  //         this.cargando = false;
  //       }
  //     );
  //   } catch (exception) {
  //     console.log(exception);
  //   }
  // }

  enviarFormulario(formData: Usuariosxd, username: string) {
    this.cargando = true;
    // Llamada al servicio para registrar al usuario
    if (this.registrationForm.valid) {
      if (this.registrationForm.get('Correo')?.hasError('invalidEmail')) {
        this.errorMessage = { Message: 'Formato incorrecto para el correo electrónico.' };
        this.mostrarDanger();
        this.cargando = false;
      } else {
        this.registerService.registerxd(formData, username).subscribe(
          (response) => {
            this.mostrarAlerta();
            this.cargando = false;
            this.registrationForm.reset();
          },
          (error) => {
            this.errorMessage = error.error;
            this.mostrarDanger();
            this.cargando = false;

          }
        );
      }
    } else {
      this.errorMessage = { Message: 'Por favor, asegúrese de completar todos los campos para finalizar el registro.' };
      this.mostrarDanger();
      this.cargando = false;
    }
  }

  //metodo para abrir modal para visualizar roles
  abrirModal( cliente: string) {
    this.viewRol = true;
    this.usuarioRol = cliente;
  }
  cerrarModal(){
    this.viewRol = false;
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
    userData.rol = this.xd;
    console.log(this.xd)
    console.log(userData)
    // Llamada al servicio para registrar al usuario
    if (this.UpdateForm.valid) {
      if (this.UpdateForm.get('Correo')?.hasError('invalidEmail')) {
        this.errorMessage = { Message: "Formato incorrecto para el correo electronico." };
        this.mostrarDanger();
        this.cargando = false
      }
      else {

        this.registerService.ModificarEmpleado(userData)
          .subscribe(
            response => {
              this.mostrarEditAlerta();
              this.cargando = false
              this.UpdateForm.reset();
              this.cerrarModificarEmpleado();
              window.location.reload();
            },
            error => {
              console.error("Error:", error);
              this.errorMessage = error.error;
              this.mostrarDanger();
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

  show() {
    this.showToast = true;
  }

  EmpleadoSeleccionado(empleado: Empleado) {
    this.empleadoActual = Object.assign({}, empleado);
    this.empleadoSeleccionado.push(this.empleadoActual);

    this.UpdateForm.patchValue({
      Nit_empresa: this.empleadoActual.nit_empresa,
      Identificacion: this.empleadoActual.identificacion,
      Nombre: this.empleadoActual.nombre,
      Apellido: this.empleadoActual.apellido,
      Sexo: this.empleadoActual.sexo,
      Ubicacion: this.empleadoActual.ubicacion,
      Telefono: this.empleadoActual.telefono,
      Correo: this.empleadoActual.correo,
      Usuario: this.empleadoActual.usuario,
      Contrasena: this.empleadoActual.contrasena
    });
    this.abrirModificarEmpleado();
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
