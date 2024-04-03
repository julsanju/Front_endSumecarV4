import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MensajeError } from 'src/app/Interfaces/mensaje-error';
import { AuthService } from 'src/app/services/auth.service';
import { RegisterService } from 'src/app/services/register.service';
import { FirebaseModule } from '../prueba-login/firebase/firebase.module';
import { CommonModule } from '@angular/common';
import { AppComponent } from 'src/app/app.component';
import { DepartamentoCiudad } from 'src/app/Interfaces/departamento-ciudad';
import { UsuariosServicesService } from 'src/app/services/usuarios-services.service';

@Component({
  selector: 'app-login-aditional',
  standalone: true,
  imports: [ReactiveFormsModule,
            FormsModule,
            FirebaseModule,
            CommonModule],
  templateUrl: './login-aditional.component.html',
  styleUrl: './login-aditional.component.css'
})
export class LoginAditionalComponent implements OnInit {
  foto:any = ''
  registrationForm: FormGroup;
  formData: FormData;
  cargando = false;
  errorMessage: MensajeError | null = null;
  showAlert: boolean = false;
  showAlertDanger: boolean = false;
  //datos de localstorage
  nombre:any = ''
  uid:any = ''  
  email:any = ''
  //departamentos y ciudades
  departamentos: DepartamentoCiudad[] = [];
  ciudades: DepartamentoCiudad[] = [];

  constructor(private formBuilder: FormBuilder,
              private http: HttpClientModule,
              private registerService: RegisterService,
              private servicioUsuarios: UsuariosServicesService,
              private router: Router,
              private auth: AuthService,
              private app: AppComponent){
                
    this.app.mostrarMenu = false;            
    this.formData = new FormData()

    this.registrationForm = this.formBuilder.group({
      Identificacion: ['', Validators.required],
      Sexo: ['', Validators.required],
      Ubicacion: ['', Validators.required],
      Telefono: ['', Validators.required],
      Usuario: ['', Validators.required],
      Departamento: ['', Validators.required],
      Ciudad: ['', Validators.required],
      termsCheckbox: [false, Validators.requiredTrue]
    });
  }
  ngOnInit(): void {
    this.obtenerImagen()
    //metodo para setear los departamentos
    this.servicioUsuarios.obtenerDepartamento().subscribe(
      (response) => {
        this.departamentos = response;
      },
      (error) => {
        console.error('Error obteniendo departamentos', error);
      }
    );
    this.mostrarCiudad();
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

  obtenerImagen(){
    this.foto = localStorage.getItem('photoURL');
  }

  //metodo para poder crear el usuario
  crearUsuario() {
    this.cargando = true;
    
    try {
      const formData = new FormData();

      //capsula para datos que provienenen de localStorage
        this.nombre = localStorage.getItem('nombre')
        this.uid = localStorage.getItem('uid')
        this.foto = localStorage.getItem('photoURL')
        this.email = localStorage.getItem('email')

        formData.append('Nombre', this.nombre.toLowerCase());
        formData.append('Sexo', this.registrationForm.value.Sexo);
        formData.append('ImagenUrl', this.foto);
        formData.append('Identificacion', this.registrationForm.value.Identificacion);
        formData.append('Rol', 'cliente');
        formData.append('Ubicacion', this.registrationForm.value.Ubicacion);
        formData.append('Telefono', this.registrationForm.value.Telefono);
        formData.append('Correo', this.email);
        formData.append('Usuario', this.registrationForm.value.Usuario);
        formData.append('Departamento', this.registrationForm.value.Departamento);
        formData.append('Ciudad', this.registrationForm.value.Ciudad);
        // Continuar con el proceso sin agregar imágenes al formData
        this.enviarFormulario(formData, this.uid)
        localStorage.setItem('UserData', this.registrationForm.value.Usuario)
        //return;
      
    } catch (exception) {
      console.log(exception);
    }
  }

  enviarFormulario(formData: FormData, uid: string) {
    
    this.cargando = true;
    // Llamada al servicio para registrar al usuario
    if (this.registrationForm.valid) {
      if (this.registrationForm.get('Correo')?.hasError('invalidEmail')) {
        this.errorMessage = { Message: 'Formato incorrecto para el correo electrónico.' };
        this.mostrarDanger();
        this.cargando = false;
      } else {
        this.registerService.registerUserWithDataGoogle(formData, uid).subscribe(
          (response) => {
            this.mostrarAlerta();
            this.cargando = false;
            this.registrationForm.reset();
            this.router.navigate(['/menu/dashboard']).then(() => window.location.reload());
          },
          (error) => {
            console.error('Error:', error);
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

  cancelar(){
    this.auth.logOut();
    this.router.navigate(['/prueba-login']).then(() => window.location.reload());
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
  getSuccesAlertClasses() {
    return this.objectALertClasses(!this.showAlert, this.showAlert, !this.showAlert)
  }
  //animacion alerta danger
  getDangerAlertClasses() {
    return this.objectALertClasses(!this.showAlertDanger, this.showAlertDanger, !this.showAlertDanger)
  }
}
