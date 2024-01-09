import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Empleado } from 'src/app/Interfaces/empleado';
import { MensajeError } from 'src/app/Interfaces/mensaje-error';
import { Usuarios } from 'src/app/Interfaces/usuarios';
import { UsuariosView } from 'src/app/Interfaces/usuarios-view';
import { NumbersOnlyDirective } from 'src/app/directives/numbers-only.directive';
import { RegisterService } from 'src/app/services/register.service';
import { UsuariosServicesService } from 'src/app/services/usuarios-services.service';

@Component({
  selector: 'app-crear-usuario',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './crear-usuario.component.html',
  styleUrl: './crear-usuario.component.css'
})
export class CrearUsuarioComponent implements OnInit {
  registrationForm: FormGroup;
  dataSource: Empleado[] = [];
  originalDataSource: Empleado[] = [];
  currentPage: number = 1;
  pageSize: number = 8;
  //loading
  cargando = false;
  //modal
  showAlert: boolean = false;
  showAlertDanger: boolean = false;
  showModal: boolean = false;
  errorMessage: MensajeError | null = null;
  constructor(private servicioUsuarios: UsuariosServicesService, private formBuilder: FormBuilder, private registerService: RegisterService) {
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
    }, 1000);

  }

  mostrarDanger() {
    this.showAlertDanger = true;

    setTimeout(() => {
      this.showAlertDanger = false;
    }, 4000);
  }

  mostrarModalDanger() {
    this.showModal = true;
  }

  cerrar_modalDanger() {
    this.showModal = false;
    // Otras acciones que necesitas realizar al cancelar la selección
  }

  mostrarModal() {
    this.showModal = true;
  }

  cerrar_modal() {
    this.showModal = false;
    // Otras acciones que necesitas realizar al cancelar la selección
  }


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

          );
      }
    }
    else {
      this.errorMessage = { Message: "Por favor, Asegúrese Completar todos los campos para finalizar el registro." };
      this.mostrarDanger();
      this.cargando = false
    }

  }

}
