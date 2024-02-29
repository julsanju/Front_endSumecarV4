import { Component, OnInit, ViewChild } from '@angular/core';
import { ProductsServicesService } from 'src/app/services/products-services.service';
import { Productos } from 'src/app/Interfaces/productos';
import { Empleado } from 'src/app/Interfaces/empleado';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { MensajeError } from 'src/app/Interfaces/mensaje-error';
import { Router } from '@angular/router';
import { PeticioneServicesService } from 'src/app/services/peticione-services.service';
import { MatTableDataSource } from '@angular/material/table'; // Importa MatTableDataSource
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { DataProductsService } from '../../services/data-products.service';
import { DialogOverviewComponent } from '../dialog-overview/dialog-overview.component';
import { DatosAccordeon } from 'src/app/Interfaces/datosAccordeon';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-confirmed-products',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './confirmed-products.component.html',
  styleUrls: ['./confirmed-products.component.css']
})
export class ConfirmedProductsComponent implements OnInit {
  dataUser: string = '';
  correo: string = '';
  isLoading: boolean = true;
  errorOccurred: boolean = false;
  errorImageURL: string = "";
  accordeon: { [key: number]: boolean } = {};
  //accordeon: boolean[] = Array.from({ length: this.getPaginatedData().length }, () => false);
  //accordeon: boolean = false;
  private rolSubject = new Subject<boolean>();
  errorMessage: MensajeError | null = null;
  spinner: boolean = false;
  loading: boolean = true;
  data: Productos[] = [];
  dataAccordeon: DatosAccordeon[] = [];
  dataOriginalAccordeon: DatosAccordeon[] = [];
  searchForm: FormGroup;
  term: string = '';
  data2: Empleado[] = [];
  displayedColumns: string[] = ['# Orden', 'Codigo', 'Articulo', 'Laboratorio'];
  resultadoSearch: boolean = false
  // Variables de paginación
  pageSize: number = 5;
  currentPage: number = 1;

  constructor(private formBuilder: FormBuilder, private servicio: ProductsServicesService, private router: Router, private peticion: PeticioneServicesService) {
    this.searchForm = this.formBuilder.group({
      searchInput: [''],
      searchNumber: ['']
    });
    this.searchForm.get('searchInput')?.valueChanges.subscribe(value => {
      this.filterProductsbyclient(value);
    });

    this.searchForm.get('searchNumber')?.valueChanges.subscribe(value => {
      if (value === null || value === '') { // Verifica si el valor es nulo o vacío
        this.dataAccordeon = this.dataOriginalAccordeon; // Restablece los datos originales
      } else {
        this.filterProductsbyNumber(value);
      }
    });

  }


  ngOnInit() {
    setTimeout(() => {
      this.loading = true;
    }, 1000);

    // Llamamos a obtenerCorreo y nos suscribimos al observable resultante
    this.validacionRol();

    this.rolSubject.subscribe((esEmpleado: boolean) => {
      if (esEmpleado) {
        this.handleEmpleadoCase();
      } else {

        this.handleClienteCase();
      }

    });

    
  }


  //metodos para poder saber si es empleado o cliente
  //empleado
  private handleEmpleadoCase() {
    this.obtenerCorreo().subscribe(
      (correo) => {
        this.correo = correo;

        if (this.correo) {
          // this.servicio.obtenerFiltradoEmpleado().subscribe(
          //   (response) => {
          //     this.data = response;
          //     this.isLoading = false;
          //   },
          //   (error) => {
          //     console.error('Error al obtener los productos: ', error);
          //     this.loading = false;
          //     this.mostrarError();
          //     this.isLoading = false;
          //   }
          // );
          this.servicio.obtenerDatosAccordeon().subscribe(
            (response) => {
              this.dataAccordeon = response;
              this.dataOriginalAccordeon = response;
              this.isLoading = false;
            },
            (error) => {
              console.error('Error al obtener los productos: ', error);
              this.loading = false;
              this.mostrarError();
              this.isLoading = false;
            }
          );
        }
      },
      (error) => {
        console.error('Error al obtener el correo: ', error);
        this.loading = false;
      }
    );
  }

  //cliente
  private handleClienteCase() {
    this.obtener_usuarioToClientes().subscribe(
      (usuario) => {
        this.dataUser = usuario;

        if (this.dataUser) {
          this.servicio.obtenerDatosAccordeonCliente(this.dataUser).subscribe(
            (response) => {
              this.dataAccordeon = response;
              this.dataOriginalAccordeon = response;
              this.isLoading = false;
            },
            (error) => {
              console.error('Error al obtener los productos: ', error);
              this.loading = false;
              this.mostrarError();
              this.isLoading = false;
            }
          );
        }
      }
    );
  }


  private obtener_usuario(username: string) {
    //obtener username
    const userDataString = localStorage.getItem('userData');
    if (userDataString) {
      try {
        // Intenta analizar la cadena como JSON
        const userData = JSON.parse(userDataString);
        username = userData.usuario; // Actualiza la propiedad 'username' con el valor correcto
      } catch (error) {
        // En caso de un error al analizar JSON, puedes manejarlo o simplemente retornar false
        console.error('Error al analizar JSON:', error);
      }
    }
    return username;
  }

  private obtener_usuarioToClientes(): Observable<string> {
    return new Observable((observer) => {
      const userDataString = localStorage.getItem('userData');
      if (userDataString) {
        try {
          const userData = JSON.parse(userDataString);
          const username = userData.usuario;
          observer.next(username);
          observer.complete();
        } catch (error) {
          observer.error('Error al analizar JSON:');
        }
      } else {
        observer.error('No se encontró userData en localStorage.');
      }
    });
  }


  obtenerCorreo(): Observable<string> {
    var name = this.obtener_usuario(this.dataUser);

    return this.peticion.obtenerCorreo(name).pipe(
      map((response) => {
        this.data2 = response;
        return this.data2[0].correo;
      })
    );

  }

  validacionRol(): void {
    var name = this.obtener_usuario(this.dataUser);

    this.peticion.obtenerCorreo(name).subscribe(

      (response) => {
        this.data2 = response;
        const esEmpleado = this.data2[0].rol === 'empleado' || this.data2[0].rol === 'admin';
        this.rolSubject.next(esEmpleado);
        console.log(this.data2);
        console.log(esEmpleado);
      },
      (error) => {
        // Manejar errores si es necesario
        console.error(error);
        this.rolSubject.next(false); // En caso de error, asumimos que no es empleado

      }
    );
  }

  finalizarPeticionProducto(id: number): void {
    this.servicio.FinalizarPeticionProducto(id).subscribe(
      () => {
        this.spinner = true;
        this.spinner = false;

        Swal.fire('La peticion ha sido finalizada correctamente!', '', 'success');

        this.errorMessage = null; // Limpiar el mensaje de error si hubo éxito
        console.log('Login exitoso');
        this.router.navigate(['/menu/finished-products']);
      },
      (error) => {
        this.spinner = false;

        this.errorMessage = error.Message; // Accede al campo "Message" del JSON de error


        Swal.fire({
          title: 'ERROR',
          html: `${this.errorMessage}`,
          icon: 'error',
        });
      }
    );
  }

  mostrarError(): void {
    // Lógica para mostrar la imagen de error en lugar del mensaje
    this.errorImageURL = 'https://flowbite.s3.amazonaws.com/blocks/marketing-ui/404/404-computer.svg';

    this.errorOccurred = true;
    this.isLoading = false;

  }

  abrirCerrarAccordeon(numeroOrden: number) {
    this.accordeon[numeroOrden] = !this.accordeon[numeroOrden];
  }

  getPaginatedData(): DatosAccordeon[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    return this.dataAccordeon.slice(startIndex, endIndex);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
  }

  getEndIndex(): number {
    return Math.min(this.currentPage * this.pageSize, this.data.length);
  }

  onKeyPress(event: KeyboardEvent) {
    // Obtén el código de la tecla presionada
    const charCode = event.which || event.keyCode;

    // Permitir solo números (códigos de tecla entre 48 y 57)
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }

  }

  //metodo para filtrar roles de usuario
  esAdmin(): boolean {
    // Recupera la información del usuario desde localStorage
    const userDataString = localStorage.getItem('userData');
    if (userDataString) {
      try {
        // Intenta analizar la cadena como JSON
        const userData = JSON.parse(userDataString);
        return userData.rol === 'admin'; // Verifica la propiedad correcta 'rol'
      } catch (error) {
        // En caso de un error al analizar JSON, puedes manejarlo o simplemente retornar false
        console.error('Error al analizar JSON:', error);
        return false;
      }
    }
    return false; // Retorna false si no se encuentra información del usuario
  }

  esEmpleado(): boolean {
    const userDataString = localStorage.getItem('userData');
    if (userDataString) {
      try {
        const userData = JSON.parse(userDataString);
        return userData.rol === 'empleado';
      } catch (error) {
        console.error('Error al aalizar JSON:', error)
        return false;
      }
    }
    return false;

  }

  esCliente(): boolean {
    const userDataString = localStorage.getItem('userData');
    if (userDataString) {
      try {
        const userData = JSON.parse(userDataString);
        return userData.rol === 'cliente';
      } catch (error) {
        console.error('Error al aalizar JSON:', error)
        return false;
      }
    }
    return false;
  }

  //metodo para filtrar productos por cliente
  filterProductsbyclient(value: string) {
    this.dataAccordeon = this.dataOriginalAccordeon.filter(data => {
      const searchValue = value.toLowerCase();

      const clienteMatch = data.cliente.toLowerCase().includes(searchValue);
      const fechaMatch = data.fecha.toLowerCase().includes(searchValue);
      const telefonoMatch = data.telefono.toLowerCase().includes(searchValue);

      return clienteMatch || fechaMatch || telefonoMatch;
    });
    this.resultadoSearch = this.dataAccordeon.length === 0;
    this.resultadoSearch = !this.dataAccordeon.length;
  }

  //metodo para filtrar productos por numero de orden
  filterProductsbyNumber(value: number) {
    if (!value && value !== 0) {
      this.dataAccordeon = this.dataOriginalAccordeon;
      return;
    }

    const searchValue = value.toString();
    this.dataAccordeon = this.dataOriginalAccordeon.filter(data => {
      const numeroOrden = data.numero_orden.toString();
      return numeroOrden.startsWith(searchValue);
    });
    this.resultadoSearch = this.dataAccordeon.length === 0;
  }


}
