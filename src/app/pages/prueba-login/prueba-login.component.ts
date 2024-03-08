
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import { LoginServicesService } from '../../services/login-services.service';
import { Login } from '../../Interfaces/login';
import { MensajeError } from '../../Interfaces/mensaje-error';
import { FormBuilder, FormGroup, Validators, FormControl, ReactiveFormsModule } from '@angular/forms';
import { SharedServicesService } from '../../services/shared-services.service';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import Swal from 'sweetalert2';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from 'src/app/app.component';
import { UsuariosServicesService } from 'src/app/services/usuarios-services.service';
import { DepartamentoCiudad } from 'src/app/Interfaces/departamento-ciudad';
import { RegisterService } from 'src/app/services/register.service';
import { forkJoin } from 'rxjs';
import { CommonModule } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
@Component({
  selector: 'app-prueba-login',
  standalone: true,
  imports: [ReactiveFormsModule,
    CommonModule,
    RouterModule,
    HttpClientModule,
    RouterOutlet],
  templateUrl: './prueba-login.component.html',
  styleUrls: ['./prueba-login.component.css'],

})
export class PruebaLoginComponent implements OnInit {

  users = [
    { value: 'cliente', viewValue: 'Cliente' },
    { value: 'empleado', viewValue: 'Empleado' },
    { value: 'admin', viewValue: 'Admin' }
  ];
  registrationForm: FormGroup;
  errorMessage: MensajeError | null = null;
  passwordVisible: boolean = true;
  disableSelect = new FormControl(false);
  loginForm: FormGroup;
  email: string = '';
  password: string = '';
  passwordStrength: string = '';
  isSelectActive: boolean = false; // Variable para controlar la animación del combobox
  userData: any;
  roles: string[] = ['cliente', 'empleado'];
  spinner: boolean = false;
  modalRegister:boolean = true;
  //loading
  cargando = false;
  mostrarContrasena: boolean = false;
  departamentos: DepartamentoCiudad[] = [];
  ciudades: DepartamentoCiudad[] = [];
  showAlert: boolean = false;
  showAlertDanger: boolean = false;
  //imagenes
  //imagenes
  @ViewChild('fileInput') fileInput: ElementRef | undefined;
  selectedImages: string[] = [];
  formData: FormData;
  files: any = []

  mostrar_contrasena() {
    this.mostrarContrasena = !this.mostrarContrasena
  }

  constructor(private formBuilder: FormBuilder,
    private loginService: LoginServicesService,
    private servicioUsuarios: UsuariosServicesService,
    private registerService: RegisterService,
    private app: AppComponent,
    private data: SharedServicesService,
    private router: Router,
    private sanitizer: DomSanitizer) {

    this.formData = new FormData()

    this.loginForm = this.formBuilder.group({
      usuario: ['', [Validators.required, Validators.email]],
      contrasena: ['', Validators.required],
      rol: ['Usuario', Validators.required],
    });

    this.registrationForm = this.formBuilder.group({
      Identificacion: ['', Validators.required],
      Rol: ['', Validators.required],
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
      Imagen: ['']
    });
    //ocultar el menu version movil para el login
    this.app.mostrarMenu = false;
  }

  ngOnInit(): void {
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
    console.log(imagen);

    if (imagen.type.startsWith('image/')) {
      console.log('Sí es una imagen');
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

  crearUsuario() {
    this.cargando = true;
    try {
      const formData = new FormData();
      // Verificar si hay archivos
      if (this.files.length === 0 || !Image) {
        console.log('No se proporcionaron imágenes.');
        formData.append('Nombre', this.registrationForm.value.Nombre);
        formData.append('Apellido', this.registrationForm.value.Apellido);
        formData.append('Sexo', this.registrationForm.value.Sexo);
        formData.append('Contrasena', this.registrationForm.value.Contrasena);
        formData.append('ImagenUrl', '');
        formData.append('Identificacion', this.registrationForm.value.Identificacion);
        formData.append('Rol', this.registrationForm.value.Rol);
        formData.append('Ubicacion', this.registrationForm.value.Ubicacion);
        formData.append('Telefono', this.registrationForm.value.Telefono);
        formData.append('Correo', this.registrationForm.value.Correo);
        formData.append('Usuario', this.registrationForm.value.Usuario);
        formData.append('Contrasena', this.registrationForm.value.Contrasena);
        formData.append('Departamento', this.registrationForm.value.Departamento);
        formData.append('Ciudad', this.registrationForm.value.Ciudad);
        // Continuar con el proceso sin agregar imágenes al formData
        this.enviarFormulario(formData, this.registrationForm.value.Usuario)
        console.log(this.registrationForm.value.Identificacion)
        //return;
      }

      // Si hay archivos, cargar imágenes y enviar el formulario
      const imagesLoaded$ = forkJoin(this.files.map((item: File) => this.blobFile(item)));

      imagesLoaded$.subscribe(
        (images: any) => {

          formData.append('Nombre', this.registrationForm.value.Nombre);
          formData.append('Apellido', this.registrationForm.value.Apellido);
          formData.append('Sexo', this.registrationForm.value.Sexo);
          formData.append('Contrasena', this.registrationForm.value.Contrasena);

          images.forEach((image: any) => {
            // Agrega las imágenes al FormData
            if (image && image.blob) {
              formData.append('ImagenUrl', image.blob);
            }
          });

          formData.append('Identificacion', this.registrationForm.value.Identificacion);
          formData.append('Rol', this.registrationForm.value.Rol);
          formData.append('Ubicacion', this.registrationForm.value.Ubicacion);
          formData.append('Telefono', this.registrationForm.value.Telefono);
          formData.append('Correo', this.registrationForm.value.Correo);
          formData.append('Usuario', this.registrationForm.value.Usuario);
          formData.append('Contrasena', this.registrationForm.value.Contrasena);
          formData.append('Departamento', this.registrationForm.value.Departamento);
          formData.append('Ciudad', this.registrationForm.value.Ciudad);

          this.enviarFormulario(formData, this.registrationForm.value.Usuario);
          this.cargando = false;

        },
        (error) => {
          console.error('Error al cargar imágenes:', error);
          this.mostrarDanger();
          this.cargando = false;
        }
      );
    } catch (exception) {
      console.log(exception);
    }
  }

  enviarFormulario(formData: FormData, username: string) {
    this.cargando = true;
    // Llamada al servicio para registrar al usuario
    if (this.registrationForm.valid) {
      if (this.registrationForm.get('Correo')?.hasError('invalidEmail')) {
        this.errorMessage = { Message: 'Formato incorrecto para el correo electrónico.' };
        this.mostrarDanger();
        this.cargando = false;
      } else {
        this.registerService.registerUser(formData, username).subscribe(
          (response) => {
            console.log(response);
            this.mostrarAlerta();
            this.cargando = false;
            this.registrationForm.reset();
          },
          (error) => {
            console.error('Error:', error);
            console.log(error.error);
            this.errorMessage = error.error;
            this.mostrarDanger();
            console.log(this.errorMessage?.Message);
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

  //modal de register
  abrirRegister(){
    this.modalRegister = true;
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

  getRegister(){
    return this.objectALertClasses(this.modalRegister, this.modalRegister, this.modalRegister)
    
  }
  cerrarRegister(){
    this.modalRegister = false;
  }

  getSuccesAlertClasses() {
    return this.objectALertClasses(!this.showAlert, this.showAlert, !this.showAlert)
  }
  //animacion alerta danger
  getDangerAlertClasses() {
    return this.objectALertClasses(!this.showAlertDanger, this.showAlertDanger, !this.showAlertDanger)
  }
  onPasswordChange() {
    const password = this.loginForm.get('contrasena')?.value;

    if (password.length < 6) {
      this.passwordStrength = 'weak';
    } else if (password.length < 10) {
      this.passwordStrength = 'medium';
    } else {
      this.passwordStrength = 'strong';
    }
  }

  EventoEnviar() {
    //mensaje
    const usuario = this.loginForm.get('usuario')?.value;
    // Enviar datos al servicio
    this.data.enviarDatos(usuario);
  }

  onSubmit() {
    //activar loading
    this.cargando = true;
    //login
    const userData: Login = this.loginForm.value;

    this.spinner = true;

    this.loginService.LoginValidation(userData).subscribe(
      (response) => {

        this.errorMessage = null; // Limpiar el mensaje de error si hubo éxito

        this.router.navigate(['/menu/dashboard'])
          .then(() => window.location.reload())
        const userData2 = {
          usuario: this.loginForm.get('usuario')?.value,
          contrasena: this.loginForm.get('contrasena')?.value,
          rol: this.loginForm.get('rol')?.value,
        };

        localStorage.setItem('userData', JSON.stringify(userData2));
        this.userData = userData2;

        localStorage.setItem('userData', JSON.stringify(userData2));
        this.userData = userData2;
        const user2 = sessionStorage.setItem(
          'userData',
          this.loginForm.get('usuario')?.value
        );
      },
      (error) => {
        console.error('Error:', error);

        this.spinner = false;
        this.cargando = false;
        this.errorMessage = error.Message;

        Swal.fire({
          title: 'ERROR',
          html: `${this.errorMessage}`,
          icon: 'error',
        });
      }
    );
    if (this.loginForm.valid) {
      console.log('Formulario válido');
      console.log('Email:', this.loginForm.value.email);
      console.log('Contraseña:', this.loginForm.value.password);
      console.log('Rol:', this.loginForm.value.role);
    }
  }

  toggleSelect() {
    this.isSelectActive = !this.isSelectActive;
  }

  direccionCambio() {
    this.router.navigate(['/cambiar-contrasena']);
  }
}

