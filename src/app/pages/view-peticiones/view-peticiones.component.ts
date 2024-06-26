import { Component, OnInit, ViewChild,  ElementRef, QueryList,ViewChildren, ViewContainerRef } from '@angular/core';
import { PeticioneServicesService } from 'src/app/services/peticione-services.service';
import { Peticiones } from 'src/app/Interfaces/peticiones';
import { Empleado } from 'src/app/Interfaces/empleado';
import { Observable} from 'rxjs';
import Swal from 'sweetalert2';
import { MensajeError } from 'src/app/Interfaces/mensaje-error';
import { Router } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { EnvioCorreosService } from 'src/app/services/envio-correos.service';
import { UsuariosServicesService } from 'src/app/services/usuarios-services.service';
import { Correo } from 'src/app/Interfaces/correo';
import { DetallePeticionP } from 'src/app/Interfaces/detalle-peticionP';
import { CommonModule } from '@angular/common';
import { UsuariosView } from 'src/app/Interfaces/usuarios-view';
import { DetallePeticionModel } from 'src/app/Interfaces/detalle-peticion-model';


@Component({
  selector: 'app-view-peticiones',
  standalone: true,
  imports: [NgbModule, ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './view-peticiones.component.html',
  styleUrls: ['./view-peticiones.component.css'],
})
export class ViewPeticionesComponent implements OnInit {
  
  @ViewChild('vc') vc!: ViewContainerRef;
  @ViewChild('vcContainer', { read: ViewContainerRef }) container!: ViewContainerRef;
  dataUser: string = '';
  dataRol: string = '';
  correo: string = '';
  errorMessage: MensajeError | null = null;
  spinner: boolean = false;
  loading: boolean = true;
  data: Peticiones[] = [];
  dataOriginalData: Peticiones[] = [];
  resultadoSearch: boolean = false
  dataClient: Correo[] = [];
  data2: Empleado[] = [];
  displayedColumns: string[] = ['id', 'correo', 'mensaje', 'fecha', 'estado'];
  //loading 
  isLoading: boolean = true;
  errorOccurred: boolean = false;
  errorImageURL = '';
  // Variables de paginación
  pageSize: number = 5;
  currentPage: number = 1;
  //datos para modal peticiones
  usernameModalP = '';
  correoModalP = '';
  dataModalP !: Empleado
  formulario: FormGroup;
  formulario_detallesPeticion!: FormGroup;
  searchForm:FormGroup;
  usuarioSeleccionadoEmail: string = '';
  detalle: DetallePeticionP[] = [];
  peticionSeleccionada: boolean = false;
  numero_orden:number = 0;
  cliente:string = '';

  articulosEscritos: boolean[] = [];
  accordeon: { [key: number]: boolean } = {};
  showModal: boolean = false;
  showModalErrorArticulo: boolean = false;
  /** Cargando**/
  cargando:boolean = false;
  cargandoEnviar:boolean = false;

  constructor(private servicio: PeticioneServicesService,
    private router: Router,
    private formBuilder: FormBuilder,
    private peticion: EnvioCorreosService,
    private usurioService: UsuariosServicesService) {

    this.formulario = this.formBuilder.group({
      correo: ['', [Validators.required]],
      mensaje: ['', [Validators.required]],
    });

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

    this.llenarCombo();

    //metodos para mandar json para endpoint peticiones
    this.formulario_detallesPeticion = this.formBuilder.group({
      detalles: this.formBuilder.array([])
    });
    this.agregarFila();

    this.formulario_detallesPeticion.valueChanges.subscribe(data => {
      this.actualizarDetalles();
    });
    
    //metodo para obtener peticiones ya sea como cliente, empleado o admin
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
          const rol = userData.Rol[0].RolId; // Suponiendo que "Rol" es una cadena en tu objeto userData
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
  
  finalizarPeticion(id: number): void {
    this.cargando = true;
    this.servicio.FinalizarPeticion(id).subscribe(
      () => {
        this.cargando = false;
        this.spinner = true;

        Swal.fire('La peticion ha sido finalizada correctamente!', '', 'success');

        this.errorMessage = null; // Limpiar el mensaje de error si hubo éxito
        this.router.navigate(['/menu/historial-peticiones']);
      },
      (error) => {
        this.spinner = false;
        this.cargando = false;
        this.errorMessage = error.Message; // Accede al campo "Message" del JSON de error


        Swal.fire({
          title: 'ERROR',
          html: `${this.errorMessage}`,
          icon: 'error',
        });
      }
    );
  }

  abrirModal(numeroPedido: number, cliente: string) {
    
    this.peticionSeleccionada = true;
    this.numero_orden = numeroPedido;
    this.cliente = cliente;
    
  }

  cerrarModal(){
    this.peticionSeleccionada = false;
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
  /***modal para peticiones */

  async onSubmit() {
    this.cargandoEnviar = true;
    const userDataString = localStorage.getItem('userData');
    const userData = userDataString ? JSON.parse(userDataString) : null; // Parsea los datos del usuario si existen
    
    if (userData) {
      const dataClient: UsuariosView | null = await this.mapeoDatosCliente(userData.Usuario)
      const detalles: DetallePeticionP[] = this.detalle.filter(detalle => detalle.articulo.trim() !== '' && detalle.cantidad !== 0);

      const data: DetallePeticionModel[] = [
        {
          correo: this.formulario.get('correo')?.value,
          mensaje: this.formulario.get('mensaje')?.value,
          cliente: (dataClient?.nombre ?? '') + " " + (dataClient?.apellido ?? ''),
          identificacion: dataClient?.identificacion ?? '',
          telefono: dataClient?.telefono ?? '',
          direccion: dataClient?.ubicacion ?? '',
          ciudad: dataClient?.ciudad ?? '',
          detalle: detalles
        }
      ];

      this.peticion.addPeticion(data, userData.Usuario).subscribe(
        response => {
          this.cargandoEnviar = false;
          this.spinner = false;

          Swal.fire('Peticion enviada correctamente', '', 'success');
        },
        error => {
          this.cargandoEnviar = false;
          this.spinner = false;

          this.errorMessage = error.Message; 
          
          Swal.fire({
            title: 'ERROR',
            html: `${this.errorMessage}`,
            icon: 'error',
          });
        },
      );
    }

  }

  users: any[] = [];

  //llenar combobox
  llenarCombo() {
    // Llama al servicio para obtener los empleados
    this.usurioService.filtroEmpleado_admin().subscribe(
      (data: Empleado[]) => {
        // Mapea los datos obtenidos para adaptarlos al formato del array 'users'
        this.users = data.map((empleado: Empleado) => {
          return {
            value: empleado.correo,
            viewValue: empleado.nombre
          };
        });
      },
      error => {
        console.error('Error al obtener empleados: ', error);
      }
    );
  }

  setearDatosView() {
    // Llama al servicio para obtener los empleados
    this.usurioService.filtroEmpleado_admin().subscribe(
      (data: Empleado[]) => {
        // Mapea los datos obtenidos para adaptarlos al formato del array 'users'
        this.users = data.map((empleado: Empleado) => {
          return {
            value: empleado.correo,
            viewValue: empleado.nombre
          };
        });
      },
      error => {
        console.error('Error al obtener empleados: ', error);
      }
    );
  }

  agregarFila(): void {
    const detalles = this.formulario_detallesPeticion.get('detalles') as FormArray;
    detalles.push(this.formBuilder.group({
      articulo: [''],
      cantidad: [0]
    }));

    // Agrega el detalle a la interfaz
    this.detalle.push({
      articulo: '',
      cantidad: 0
    });
  }

  actualizarDetalles(): void {
    this.detalle = this.detallesArray.controls.map(control => control.value);

    // Filtra los detalles con valores vacíos o cantidad igual a 0
    this.detalle = this.detalle.filter(detalle => detalle.articulo.trim() !== '' && detalle.cantidad !== 0);
  }


  get detallesArray() {
    return this.formulario_detallesPeticion.get('detalles') as FormArray;
  }

  //metodos para poder poner que cuando se presione enter se pase al campo articulo
  enfocarSiguiente(i: number) {

    const next = this.vc.element.nativeElement.querySelector(`#articulo_${i+1}`);
    next.focus();
  
  }
  
  //metodo para mapear datos del cliente

  mapeoDatosCliente(username: string): Promise<UsuariosView | null> {
    return new Promise((resolve, reject) => {
      this.usurioService.obtenerMapeo(username).subscribe(
        (data: UsuariosView[]) => {
          if (data.length > 0) {
            resolve(data[0]); // Devuelve el primer cliente encontrado
          } else {
            resolve(null); // Si no se encontraron datos, devuelve null
          }
        },
        error => {
          console.error('Error al obtener empleados mapeados: ', error);
          reject(error);
        }
      );
    });
  }


  validateArticulo(index: number) {
    // Aquí puedes agregar cualquier lógica de validación necesaria para el artículo en particular
    this.articulosEscritos[index] = true;
  }

  onKeyPress(event: KeyboardEvent) {
    // Obtén el código de la tecla presionada
    const charCode = event.which || event.keyCode;

    // Permitir solo números (códigos de tecla entre 48 y 57)
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }

  }

  onUserSelect(event: any) {
    const selectedUserValue = event.target.value;

    // Actualiza el correo electrónico en el control del formulario
    this.formulario.get('correo')?.setValue(selectedUserValue);

    // Puedes acceder al servicio para obtener más detalles, incluido el correo electrónico
    this.usurioService.filtroEmpleado_admin().subscribe(
      (data: Empleado[]) => {
        const userDetails = data.find(user => user.correo === selectedUserValue);
        if (userDetails) {
          // Actualiza otros detalles del usuario si es necesario
          // Ejemplo: this.formulario.get('nombre').setValue(userDetails.nombre);
        }
      },
      error => {
        console.error('Error al obtener detalles del usuario: ', error);
      }
    );
  }

  updateEmail(email: string) {
    this.usuarioSeleccionadoEmail = email;
  }

  addRow() {
    this.detalle.push({
      articulo: '',
      cantidad: 0
    });

    this.formulario_detallesPeticion.addControl(`articulo_${this.detalle.length - 1}`, new FormControl(''));
    this.formulario_detallesPeticion.addControl(`cantidad_${this.detalle.length - 1}`, new FormControl(''));
  }

  mostrarModal() {
    this.showModal = true;
  }

  cerrar_modal() {
    this.showModal = false;
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
    this.resultadoSearch = false;
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

  EliminarPeticion(){
    console.log(this.numero_orden)
    this.cargando = true;
    this.servicio.EliminarPeticion(this.numero_orden).subscribe(
      (response) => {
        this.spinner = true;
        this.spinner = false;

        this.errorMessage = null;
        this.peticionSeleccionada = false;
        this.cargando = false;
        Swal.fire('La peticion ha sido Eliminada correctamente!', '', 'success').then(() => window.location.reload());

      },
      (error) => {
        this.spinner = false;

        this.errorMessage = error.Message; // Accede al campo "Message" del JSON de error


        Swal.fire({
          title: 'ERROR',
          html: `${this.errorMessage}`,
          icon: 'error',
        });
        this.peticionSeleccionada = false;
        this.cargando = false;
      }
    )
  } 
}



