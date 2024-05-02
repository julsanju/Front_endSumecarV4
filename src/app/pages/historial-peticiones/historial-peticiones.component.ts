import { Component } from '@angular/core';
import { PeticioneServicesService } from 'src/app/services/peticione-services.service';
import { Peticiones } from 'src/app/Interfaces/peticiones';
import { Empleado } from 'src/app/Interfaces/empleado';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-historial-peticiones',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './historial-peticiones.component.html',
  styleUrls: ['./historial-peticiones.component.css']
})
export class HistorialPeticionesComponent {
  dataUser: string = '';
  dataRol: string = '';
  correo: string = '';
  private rolSubject = new Subject<boolean>();

  //loading 
  isLoading: boolean = true;
  errorOccurred: boolean = false;
  errorImageURL = '';
  //name = 'julsanju2004@gmail.com';
  loading: boolean = true;
  data: Peticiones[] = [];
  dataOriginalData: Peticiones[] = [];
  searchForm:FormGroup;
  resultadoSearch: boolean = false
  data2: Empleado[] = [];
  displayedColumns: string[] = ['id', 'correo', 'mensaje', 'fecha', 'estado'];
  accordeon: { [key: number]: boolean } = {};
  // Variables de paginación
  pageSize: number = 5;
  currentPage: number = 1;

  constructor(private servicio: PeticioneServicesService, private formBuilder: FormBuilder) {
    this.searchForm = this.formBuilder.group({
      searchInput: [''],
      searchNumber: ['']
    });
    this.searchForm.get('searchInput')?.valueChanges.subscribe(value => {
      this.filterProductsbyclient(value);
    });

    this.searchForm.get('searchNumber')?.valueChanges.subscribe(value => {
      if (value === null || value === '') { // Verifica si el valor es nulo o vacío
        this.data = this.dataOriginalData; // Restablece los datos originales
      } else {
        this.filterProductsbyNumber(value);
      }
    });
   }

  ngOnInit() {
    setTimeout(() => {
      this.loading = false;
    }, 2000);


    this.obtenerPeticiones();


  }

  private obtenerPeticiones() {
    this.obtener_rol().subscribe(
      (response) => {
        this.dataUser = response.username;
        this.dataRol = response.rol
        //definimos que el estado de esta pagina es de tipo pendiente
        const estado = "Pendiente"
        if (this.dataUser && this.dataRol) {
          // this.servicio.ObtenerPeticiones(estado, this.dataUser, this.dataRol)
          this.servicio.ObtenerPeticiones(estado, this.dataUser, this.dataRol)
          .subscribe(
            (response) => {
              this.data = response;
              this.dataOriginalData = response;
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


  private obtener_usuario(): Observable<string> {
    return new Observable((observer) => {
      const userDataString = localStorage.getItem('userData');
      if (userDataString) {
        try {
          const userData = JSON.parse(userDataString);
          const username = userData.Usuario;
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

  private obtener_rol(): Observable<{ username: string, rol: string }> {
    return new Observable((observer) => {
      const userDataString = localStorage.getItem('userData');
      if (userDataString) {
        try {
          const userData = JSON.parse(userDataString);
          const username = userData.Usuario;
          const rol = userData.Rol[0].RolId;
          observer.next({ username, rol });
          observer.complete();
        } catch (error) {
          observer.error('Error al analizar JSON:');
        }
      } else {
        observer.error('No se encontró userData en localStorage.');
      }
    });
  }

  mostrarError(): void {
    // Lógica para mostrar la imagen de error en lugar del mensaje
    this.errorImageURL = 'https://flowbite.s3.amazonaws.com/blocks/marketing-ui/404/404-computer.svg';

    this.errorOccurred = true;
    this.isLoading = false;

  }

  getPaginatedData(): Peticiones[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    return this.data.slice(startIndex, endIndex);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
  }

  getEndIndex(): number {
    return Math.min(this.currentPage * this.pageSize, this.data.length);
  }

  //solo numeros
  onKeyPress(event: KeyboardEvent) {
    // Obtén el código de la tecla presionada
    const charCode = event.which || event.keyCode;

    // Permitir solo números (códigos de tecla entre 48 y 57)
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }

  }
  //permisos de roles
  //admin
  esAdmin(): boolean {
    // Recupera la información del usuario desde localStorage
    const userDataString = localStorage.getItem('userData');
    if (userDataString) {
      try {
        // Intenta analizar la cadena como JSON
        const userData = JSON.parse(userDataString);
        return userData.Rol[0].RolId === '1'; // Verifica la propiedad correcta 'rol'
      } catch (error) {
        // En caso de un error al analizar JSON, puedes manejarlo o simplemente retornar false
        console.error('Error al analizar JSON:', error);
        return false;
      }
    }
    return false; // Retorna false si no se encuentra información del usuario
  }

  //empleado
  esEmpleado(): boolean {
    const userDataString = localStorage.getItem('userData');
    if (userDataString) {
      try {
        const userData = JSON.parse(userDataString);
        return userData.Rol[0].RolId === '2';
      } catch (error) {
        console.error('Error al aalizar JSON:', error)
        return false;
      }
    }
    return false;

  }

  //cliente
  esCliente(): boolean {
    const userDataString = localStorage.getItem('userData');
    if (userDataString) {
      try {
        const userData = JSON.parse(userDataString);
        return userData.Rol[0].RolId === '3';
      } catch (error) {
        console.error('Error al aalizar JSON:', error)
        return false;
      }
    }
    return false;
  }

  /** acoordeon de peticiones**/
  abrirCerrarAccordeon(numeroPeticion: number) {
    this.accordeon[numeroPeticion] = !this.accordeon[numeroPeticion];
  }

  //metodo para filtrar productos por cliente
  filterProductsbyclient(value: string) {
    this.data = this.dataOriginalData.filter(data => {
      const searchValue = value.toLowerCase();
      const clienteMatch = data.cliente.toLowerCase().includes(searchValue);
      const telefonoMatch = data.telefono.toLowerCase().includes(searchValue);
      const mensajeMatch = data.mensaje.toLocaleLowerCase().includes(searchValue);

      return clienteMatch || telefonoMatch || mensajeMatch;
    });
    this.resultadoSearch = this.data.length === 0;
  }

  //metodo para filtrar productos por numero de orden
  filterProductsbyNumber(value: number) {
    if (!value && value !== 0) {
      this.data = this.dataOriginalData;
      return;
    }

    const searchValue = value.toString();
    this.data = this.dataOriginalData.filter(data => {
      const numeroOrden = data.numero_peticion.toString();
      return numeroOrden.startsWith(searchValue);
    });
    this.resultadoSearch = this.data.length === 0;
  }
}
