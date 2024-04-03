
import { Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';

import { LoginServicesService } from '../../services/login-services.service';
import { Login } from '../../Interfaces/login';
import { MensajeError } from '../../Interfaces/mensaje-error';
import { FormBuilder, FormGroup, Validators, FormControl, ReactiveFormsModule, FormsModule, NgForm } from '@angular/forms';
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
import { FirebaseModule } from 'src/app/pages/prueba-login/firebase/firebase.module';
import { AuthService } from 'src/app/services/auth.service';
import { CaptchaServicesService } from 'src/app/services/captcha-services.service';
import { RECAPTCHA_SETTINGS, RecaptchaFormsModule, RecaptchaModule, RecaptchaSettings } from 'ng-recaptcha';
import { environment } from 'src/app/environments/environment';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-prueba-login',
  standalone: true,
  imports: [ReactiveFormsModule,
    CommonModule,
    RouterModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterOutlet,
    FirebaseModule,
    RecaptchaModule,
    RecaptchaFormsModule,
  ],
  providers: [
    {
      provide: RECAPTCHA_SETTINGS,
      useValue: {
        siteKey: environment.recaptcha.siteKey,
      } as RecaptchaSettings,
    },
  ],
  templateUrl: './prueba-login.component.html',
  styleUrls: ['./prueba-login.component.css'],

})
export class PruebaLoginComponent implements OnInit {
  //variables para autenticacion
  username = '';
  uid: any = '';
  foto: any = '';
  bool: boolean = false;
  userVerified: any = '';
  sitekey = environment.recaptcha.siteKey;
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
  modalRegister: boolean = true;
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
  //@ViewChild('recaptcha', {static: true}) recaptchaElement: any;
  @ViewChild('captchaElem') captchaElem: any;
  token: string = '';

  mostrar_contrasena() {
    this.mostrarContrasena = !this.mostrarContrasena
  }

  constructor(private formBuilder: FormBuilder,
    private firebase: AngularFireAuth,
    private ngZone: NgZone,
    private loginService: LoginServicesService,
    private servicioUsuarios: UsuariosServicesService,
    private registerService: RegisterService,
    private app: AppComponent,
    private router: Router,
    private sanitizer: DomSanitizer,
    private auth: AuthService,
    private captchaService: CaptchaServicesService) {

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
  abrirRegister() {
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

  getRegister() {
    return this.objectALertClasses(this.modalRegister, this.modalRegister, this.modalRegister)

  }
  cerrarRegister() {
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

  

  onSubmit() {
    //activar loading
    this.cargando = true;
    //login
    const userData: Login = this.loginForm.value;

    this.loginService.LoginValidation(userData).subscribe(
      (response) => {
        this.bool = true
        localStorage.setItem('bool', this.bool.toString())
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

  }

  verifyCaptcha(event: any) {
    const token = event;
    this.captchaService.verify(token).subscribe(
      isValid => {
        if (isValid) {
          this.onSubmit()
        } else {
          console.log("el captcha no pudo ser verificado correctamente")
        }
      },
      error => {
        console.error('Error al verificar reCAPTCHA:', error);
      }
    );
  }

  toggleSelect() {
    this.isSelectActive = !this.isSelectActive;
  }

  direccionCambio() {
    this.router.navigate(['/cambiar-contrasena']);
  }



  loginWithGoogle() {
    this.auth.loginGoogle()
      .then(() => {
        // La autenticación de Google se ha completado con éxito
        // Obtenemos el uid del usuario actual
        const uid = localStorage.getItem('uid');

        // Si hay un uid almacenado, verificamos el estado de autenticación del usuario
        this.firebase.authState.subscribe((userState) => {
          if (userState) {
            if (uid) {
              // El usuario está autenticado
              this.auth.isUserVerified(uid).subscribe(
                (response) => {
                  // El usuario está verificado, redirigimos a la página de dashboard
                  localStorage.setItem('userData', JSON.stringify(response.usuario));
                  
                  this.router.navigate(['menu/dashboard']);
                  localStorage.setItem('bool', this.bool.toString());
                },
                (error) => {
                  // El usuario no está verificado, redirigimos a la página de login adicional
                  this.router.navigate(['/login-aditional']);
                  console.error(error);
                }
              );
            }
          }
        });

      })
      .catch((error) => {
        // Manejamos cualquier error que ocurra durante la autenticación
        console.error("Error during Google login:", error);
      });
  }

}

