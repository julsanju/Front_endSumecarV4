
import { ChangeDetectorRef, Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';

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
import { Subscription, forkJoin, interval } from 'rxjs';
import { CommonModule } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { FirebaseModule } from 'src/app/pages/prueba-login/firebase/firebase.module';
import { AuthService } from 'src/app/services/auth.service';
import { CaptchaServicesService } from 'src/app/services/captcha-services.service';
import { RECAPTCHA_SETTINGS, RecaptchaFormsModule, RecaptchaModule, RecaptchaSettings } from 'ng-recaptcha';
import { environment } from 'src/app/environments/environment';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Contrasena } from 'src/app/Interfaces/contrasena';
import { DetalleRol } from 'src/app/Interfaces/detalle-rol';
import { Usuariosxd } from 'src/app/Interfaces/usuariosxd';


//enumeracion
enum State {
  sendEmail,
  waitingRoom,
  UpdatePassword
}
@Component({
  selector: 'app-prueba-login',
  standalone: true,
  imports: [ReactiveFormsModule,
    CommonModule,
    RouterModule,
    HttpClientModule,
    FormsModule,
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
  private subscription!: Subscription;
  //variable booleana para el autocompletado del gmail.com
  showPreview: boolean = false;
  previewValue: string = '';
  previewDomain: string = 'gmail.com';
  previewVisible: boolean = false;
  estadoCard: boolean = false;
  //variables para estado de existencia
  UserExists: boolean = false;
  UserNameSumecar: string = '';
  //variables para autenticacion
  username = '';
  uid: any = '';
  foto: any = '';
  bool: boolean = false;
  userVerified: any = '';
  sitekey = environment.recaptcha.siteKey;
  users = [
    { value: 1, viewValue: 'Admin' },
    { value: 2, viewValue: 'Empleado' },
    { value: 3, viewValue: 'Cliente' }
  ];
  detalle: DetalleRol[] = [];
  registrationForm: FormGroup;
  passwordForm: FormGroup;
  errorMessage: MensajeError | null = null;
  passwordVisible: boolean = true;
  disableSelect = new FormControl(false);
  loginForm: FormGroup;
  detalleRolForm: FormGroup;
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
  cargandoUpdatePassword: boolean = false;
  mostrarContrasena: boolean = false;
  departamentos: DepartamentoCiudad[] = [];
  ciudades: DepartamentoCiudad[] = [];
  showAlert: boolean = false;
  showAlertDanger: boolean = false;
  showModalUpdate: boolean = false;
  state: State = State.sendEmail
  //imagenes
  //imagenes
  @ViewChild('fileInput') fileInput: ElementRef | undefined;
  selectedImages: string[] = [];
  formData: FormData;
  files: any = []
  //@ViewChild('recaptcha', {static: true}) recaptchaElement: any;
  @ViewChild('captchaElem') captchaElem: any;
  @ViewChild('inputUpdatePassword') inputUpdatePassword!: ElementRef;

  token: string = '';
  DataCorreoUpdate: string = '';
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
    private captchaService: CaptchaServicesService,
    private cd: ChangeDetectorRef) {

    this.formData = new FormData()

    this.loginForm = this.formBuilder.group({
      usuario: ['', [Validators.required, Validators.email]],
      contrasena: ['', Validators.required],
      rol: ['']
      // rol: ['Usuario', Validators.required],
    });

    this.detalleRolForm = this.formBuilder.group({
      rol: ['']
    });

    this.registrationForm = this.formBuilder.group({
      Nit_empresa: ['', Validators.required],
      Identificacion: ['', Validators.required],
      Rol: this.formBuilder.array([  // Utiliza formBuilder.array para listas
      this.formBuilder.group({
        RolID: [3, Validators.required]  // Valor por defecto {RolID: 1}
      })
    ]),
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

    this.passwordForm = this.formBuilder.group({
      contrasena: ['', Validators.required],
      password: ['', Validators.required]
    })

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

    this.subscription = interval(30000).subscribe(() => {
      this.validateEstadoUpdate();
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  //autocompletar @gmail.com
  onInputChange(event: any) {
    const inputValue = event.target.value;
    const atIndex = inputValue.lastIndexOf('@');

    if (atIndex !== -1) {
      const username = inputValue.slice(0, atIndex);
      const domain = inputValue.slice(atIndex + 1);

      if (domain === '') {
        this.previewVisible = true;
        this.previewValue = `${username}@${this.previewDomain}`;
      } else if (domain === this.previewDomain) {
        this.previewVisible = true;
        this.previewValue = `${username}@${this.previewDomain}`;
      } else {
        this.previewVisible = false;
        this.previewValue = '';
      }
    } else {
      this.previewVisible = false;
      this.previewValue = '';
    }
  }

  onKeydown(event: any) {
    if (event.key === 'Tab') {
      event.preventDefault();
      event.target.value = this.previewValue;
      event.target.selectionStart = event.target.value.length;
      event.target.selectionEnd = event.target.value.length;
      this.previewVisible = false;
    }
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

  crearUsuarioXd() {
    const data = this.registrationForm.value as Usuariosxd;
    const contrasena = this.registrationForm.get('Contrasena')?.value
    const contrasena2 = document.getElementById('contrasena2') as HTMLInputElement;

    if (contrasena == contrasena2.value) {
      const nit = this.registrationForm.get('Nit_empresa')?.value
      this.servicioUsuarios.isCustomerExists(nit).subscribe(
        (response) => {
          this.UserExists = true
          this.UserNameSumecar = response.Message;
          // console.log(this.UserNameSumecar)
          const usuario = this.registrationForm.get('Usuario')?.value
          console.log(JSON.stringify(data) + " " + usuario)
          this.enviarFormulario(data, usuario);
        },
        (error) => {
          this.UserExists = false
          this.errorMessage = { Message: 'el cliente con identificacion ' + nit + ' ' + 'no existe en nuestra base de datos' };
          this.mostrarDanger();
          this.UserNameSumecar = ''
        }
      )
    }
    else {
      this.errorMessage = { Message: 'Las contraseñas no coinciden :(' };
      this.mostrarDanger();
      this.cargando = false;
    }
  }


  // crearUsuario() {
  //   this.cargando = true;
  //   try {
  //     const formData = new FormData();
  // Verificar si hay archivos
  // if (this.files.length === 0 || !Image) {
  //   console.log('No se proporcionaron imágenes.');
  //   formData.append('Nombre', this.registrationForm.value.Nombre);
  //   formData.append('Apellido', this.registrationForm.value.Apellido);
  //   formData.append('Sexo', this.registrationForm.value.Sexo);
  //   formData.append('Contrasena', this.registrationForm.value.Contrasena);
  //   formData.append('ImagenUrl', '');
  //   formData.append('Identificacion', this.registrationForm.value.Identificacion);
  //   formData.append('Rol', this.registrationForm.value.Rol);
  //   formData.append('Ubicacion', this.registrationForm.value.Ubicacion);
  //   formData.append('Telefono', this.registrationForm.value.Telefono);
  //   formData.append('Correo', this.registrationForm.value.Correo);
  //   formData.append('Usuario', this.registrationForm.value.Usuario);
  //   formData.append('Contrasena', this.registrationForm.value.Contrasena);
  //   formData.append('Departamento', this.registrationForm.value.Departamento);
  //   formData.append('Ciudad', this.registrationForm.value.Ciudad);
  //   formData.append('Nit_empresa', this.registrationForm.value.Nit_empresa);
  //   this.enviarFormulario(formData, this.registrationForm.value.Usuario)

  // }

  // Si hay archivos, cargar imágenes y enviar el formulario
  // const imagesLoaded$ = forkJoin(this.files.map((item: File) => this.blobFile(item)));

  // imagesLoaded$.subscribe(
  //   (images: any) => {

  //     formData.append('Nombre', this.registrationForm.value.Nombre);
  //     formData.append('Apellido', this.registrationForm.value.Apellido);
  //     formData.append('Sexo', this.registrationForm.value.Sexo);
  //     formData.append('Contrasena', this.registrationForm.value.Contrasena);

  //     images.forEach((image: any) => {
  // Agrega las imágenes al FormData
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

  isCustomerExists(identificacion: string) {
    this.servicioUsuarios.isCustomerExists(identificacion).subscribe(
      (response) => {
        this.UserExists = true
        this.UserNameSumecar = response.Message;
        console.log(this.UserNameSumecar)
      },
      (error) => {
        this.UserExists = false
        this.errorMessage = { Message: 'el cliente con identificacion ' + identificacion + ' ' + 'no existe en nuestra base de datos' };
        this.mostrarDanger();
        this.UserNameSumecar = ''
      }
    )
  }

  xd() {
    window.open("/email");
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

  mostrarModalUpdatePassword() {
    this.showModalUpdate = true;
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

  cerrarModalUpdate() {
    this.showModalUpdate = false;
  }
  getSuccesAlertClasses() {
    return this.objectALertClasses(!this.showAlert, this.showAlert, !this.showAlert)
  }
  //animacion alerta danger
  getDangerAlertClasses() {
    return this.objectALertClasses(!this.showAlertDanger, this.showAlertDanger, !this.showAlertDanger)
  }

  //animacion para modal cambiar contraseña
  getModalUpdatePassword() {
    return this.objectALertClasses(!this.showModalUpdate, this.showModalUpdate, !this.showModalUpdate)
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

  onRolSelectionChange(event: any) {
    const selectedRoleId = event.target.value;
    console.log('Rol seleccionado:', selectedRoleId);
  }

  onSubmit() {
    //activar loading
    this.cargando = true;
    //login
    const rolesList: DetalleRol[] = [];
    const DetalleRol = this.loginForm.get('rol')?.value;
    rolesList.push({ RolId: DetalleRol });


    const userData2: Login = {
      Usuario: this.loginForm.get('usuario')?.value,
      Contrasena: this.loginForm.get('contrasena')?.value,
      Rol: rolesList
    };
    //const detalles: DetalleRol[] = this.detalle.filter(detalle => detalle.RolId !== 0)

    console.log("Datos de usuario antes de enviar:", JSON.stringify(userData2));

    this.loginService.LoginValidation(userData2).subscribe(
      (response) => {
        this.bool = true
        localStorage.setItem('bool', this.bool.toString())
        this.errorMessage = null; // Limpiar el mensaje de error si hubo éxito

        this.router.navigate(['/menu/dashboard'])
          .then(() => window.location.reload())

        const userData2: Login = {
          Usuario: this.loginForm.get('usuario')?.value,
          Contrasena: this.loginForm.get('contrasena')?.value,
          Rol: rolesList
        };
        // localStorage.setItem('userData', JSON.stringify(userData2));
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
        }).then(() => window.location.reload());
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


  //cambiar contraseña
  peticionCambioContrasena(correo: string) {
    this.cargandoUpdatePassword = true;
    this.DataCorreoUpdate = this.inputUpdatePassword.nativeElement.value;
    this.loginService.peticionCorreo(correo).subscribe(
      (response) => {
        this.state = State.waitingRoom;
        this.cd.detectChanges();
        this.cargandoUpdatePassword = false;
      },
      (error) => {
        this.cargandoUpdatePassword = false;
        this.errorMessage = error.error;
        this.mostrarDanger();
        console.error("el error es:" + error.message)
      }
    )
  }

  validateEstadoUpdate() {
    this.loginService.ValidarEstado(this.DataCorreoUpdate).subscribe(
      (response) => {
        console.log("ya valido");
        this.state = State.UpdatePassword;
        this.cd.detectChanges();
      },
      (error) => {
        console.error("El error es: " + error.message);
      }
    );
  }

  UpdatePassword() {
    this.cargandoUpdatePassword = true;
    const dataUpdatePassword: Contrasena = this.passwordForm.value;

    if (dataUpdatePassword != null) {
      this.loginService.CambiarContrasena(dataUpdatePassword, this.DataCorreoUpdate).subscribe(
        (response) => {
          this.cargandoUpdatePassword = false;
          console.log(response.message);
          this.cerrarModalUpdate();
          this.state = State.sendEmail;
        },
        (error) => {
          this.cargandoUpdatePassword = false;
          console.error("el error es :", error)
        }
      )
    }
    else {
      console.log("las contraseñas no coinciden")
    }
  }

  declineUpdatePassword() {
    this.loginService.declineUpdate(this.DataCorreoUpdate).subscribe(
      (response) => {
        this.showModalUpdate = false;
        this.state = State.sendEmail;
        console.log("cancelado exitoso")
      },
      (error) => {
        console.error("el error es: " + error.message)
      }
    )
  }

}

