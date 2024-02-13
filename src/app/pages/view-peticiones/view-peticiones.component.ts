import { Component, ElementRef, OnInit, ViewChild, Inject, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { PeticioneServicesService } from 'src/app/services/peticione-services.service';
import { Peticiones } from 'src/app/Interfaces/peticiones';
import { Empleado } from 'src/app/Interfaces/empleado';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { MensajeError } from 'src/app/Interfaces/mensaje-error';
import { Router } from '@angular/router';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { EnvioCorreosService } from 'src/app/services/envio-correos.service';
import { UsuariosServicesService } from 'src/app/services/usuarios-services.service';
import { Correo } from 'src/app/Interfaces/correo';
import { DetallePeticionP } from 'src/app/Interfaces/detalle-peticionP';
import { CommonModule } from '@angular/common';
import { UsuariosView } from 'src/app/Interfaces/usuarios-view';
import { DetallePeticionModel } from 'src/app/Interfaces/detalle-peticion-model';
import { DetalleDetallePeticionModel } from 'src/app/Interfaces/detalle-detalle-peticion-model';

@Component({
  selector: 'app-view-peticiones',
  standalone: true,
  imports: [NgbModule, ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './view-peticiones.component.html',
  styleUrls: ['./view-peticiones.component.css'],
})
export class ViewPeticionesComponent implements OnInit {
  @ViewChild('vcContainer', { read: ViewContainerRef }) container!: ViewContainerRef;
  dataUser: string = '';
  correo: string = '';
  private rolSubject = new Subject<boolean>();
  errorMessage: MensajeError | null = null;
  spinner: boolean = false;
  loading: boolean = true;
  data: Peticiones[] = [];
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
  usuarioSeleccionadoEmail: string = '';
  detalle: DetallePeticionP[] = [];

  articulosEscritos: boolean[] = [];
  accordeon: { [key: number]: boolean } = {};
  showModal: boolean = false;
  showModalErrorArticulo: boolean = false;

  constructor(private servicio: PeticioneServicesService,
    private router: Router,
    private formBuilder: FormBuilder,
    private peticion: EnvioCorreosService,
    private usurioService: UsuariosServicesService) {

    this.formulario = this.formBuilder.group({
      correo: ['', [Validators.required]],
      mensaje: ['', [Validators.required]],
    });

  }

  ngOnInit() {
    setTimeout(() => {
      this.loading = false;
    }, 2000);

    this.llenarCombo();

    this.formulario_detallesPeticion = this.formBuilder.group({
      detalles: this.formBuilder.array([])
    });
    this.agregarFila();

    this.formulario_detallesPeticion.valueChanges.subscribe(data => {
      this.actualizarDetalles();
    });
    // Llamamos a obtenerCorreo y nos suscribimos al observable resultante

    this.handleClienteCase();

  }



  //metodos para poder saber si es empleado o cliente
  //empleado
  private handleEmpleadoCase() {
    this.obtenerCorreo().subscribe(
      (correo) => {
        this.correo = correo;

        if (this.correo) {
          this.servicio.obtenerPendientes(this.correo).subscribe(
            (response) => {
              this.data = response;
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
        //definimos que el estado de esta pagina es de tipo pendiente
        const estado = "Pendiente"
        if (this.dataUser) {
          this.servicio.obtenerPendientesCliente(estado, this.dataUser).subscribe(
            (response) => {
              this.data = response;
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

    return this.servicio.obtenerCorreo(name).pipe(
      map((response) => {
        this.data2 = response;
        return this.data2[0].correo;
      })
    );

  }

  validacionRol(): void {
    var name = this.obtener_usuario(this.dataUser);

    this.servicio.obtenerCorreo(name).subscribe(
      (response) => {
        this.data2 = response;
        const esEmpleado = this.data2[0].rol === 'empleado' || this.data2[0].rol === 'admin';
        this.rolSubject.next(esEmpleado);
      },
      (error) => {
        // Manejar errores si es necesario
        console.error(error);
        this.rolSubject.next(false); // En caso de error, asumimos que no es empleado
      }
    );
  }

  finalizarPeticion(id: number): void {
    this.servicio.FinalizarPeticion(id).subscribe(
      () => {
        this.spinner = true;
        this.spinner = false;

        Swal.fire('La peticion ha sido finalizada correctamente!', '', 'success');

        this.errorMessage = null; // Limpiar el mensaje de error si hubo éxito
        console.log('Login exitoso');
        this.router.navigate(['/menu/historial-peticiones']);
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
        return userData.rol === 'admin'; // Verifica la propiedad correcta 'rol'
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
        return userData.rol === 'empleado';
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
        return userData.rol === 'cliente';
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

  // onSubmit() {
  //   const userDataString = localStorage.getItem('userData');
  //   const data: Correo = this.formulario.value;
  //   const datadetalle: DetallePeticionP = this.formulario_detallesPeticion.value;
  //   if (userDataString) {
  //     try {
  //       // Intenta analizar la cadena como JSON
  //       const userData = JSON.parse(userDataString);
  //       this.usernameModalP = userData.usuario; // Actualiza la propiedad 'username' con el valor correcto

  //       // Agregar los datos del array 'detalle' al objeto 'data'
  //       data.detalle = [datadetalle];

  //       // Obtener los datos mapeados del cliente (síncrono)
  //       const dataMapCliente = this.mapeoDatosCliente(this.usernameModalP);

  //       console.log(data, dataMapCliente)
  //       // Combina los datos de formulario con los datos mapeados del cliente
  //       const combinedData = { ...data, ...dataMapCliente };

  //       // Llamar al método addPeticion() con los datos combinados
  //       this.peticion.addPeticion(combinedData, this.usernameModalP).subscribe(
  //         response => {
  //           this.spinner = false;
  //           Swal.fire('Peticion enviada correctamente', '', 'success');
  //         },
  //         error => {
  //           this.spinner = false;
  //           this.errorMessage = error.Message; // Accede al campo "Message" del JSON de error
  //           console.log(this.errorMessage);
  //           Swal.fire({
  //             title: 'ERROR',
  //             html: `${this.errorMessage}`,
  //             icon: 'error',
  //           });
  //         }
  //       );

  //     } catch (error) {
  //       // En caso de un error al analizar JSON, puedes manejarlo o simplemente retornar false
  //       console.error('Error al analizar JSON:', error);
  //     }
  //   }
  // }

  // onSubmit() {
  //   const userDataString = localStorage.getItem('userData');
  //   const data: Correo = this.formulario.value

  //   if (userDataString) {
  //     try {
  //       // Intenta analizar la cadena como JSON
  //       const userData = JSON.parse(userDataString);
  //       this.usernameModalP = userData.usuario; // Actualiza la propiedad 'username' con el valor correcto

  //     } catch (error) {
  //       // En caso de un error al analizar JSON, puedes manejarlo o simplemente retornar false
  //       console.error('Error al analizar JSON:', error);
  //     }



  //     this.peticion.addPeticion(data, this.usernameModalP).subscribe(
  //       response => {
  //         this.spinner = false;

  //         Swal.fire('Peticion enviada correctamente', '', 'success');
  //       },
  //       error => {
  //         this.spinner = false;

  //         this.errorMessage = error.Message; // Accede al campo "Message" del JSON de error
  //         console.log(this.errorMessage);

  //         Swal.fire({
  //           title: 'ERROR',
  //           html: `${this.errorMessage}`,
  //           icon: 'error',
  //         });
  //       },
  //     );
  //   }


  // }

  //metodo para agregar detalles de peticiones


  async onSubmit() {
    const userDataString = localStorage.getItem('userData');
    const userData = userDataString ? JSON.parse(userDataString) : null; // Parsea los datos del usuario si existen
    console.log(userData.usuario);
    if (userData) {
      //const data: DetallePeticionModel = this.formulario.value; // Usa 'any' para permitir la adición de propiedades dinámicamente
      const dataClient: UsuariosView | null = await this.mapeoDatosCliente(userData.usuario)
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

      console.log(data);
      this.peticion.addPeticion(data, userData.usuario).subscribe(
        response => {
          this.spinner = false;

          Swal.fire('Peticion enviada correctamente', '', 'success');
        },
        error => {
          this.spinner = false;

          this.errorMessage = error.Message; // Accede al campo "Message" del JSON de error
          console.log(this.errorMessage);

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

  // mapeoDatosCliente(username: string): Promise<any> {
  //   return new Promise((resolve, reject) => {
  //     this.usurioService.obtenerMapeo(username).subscribe(
  //       (data: UsuariosView[]) => {
  //         const mappedData = data.map((clienteData: UsuariosView) => {
  //           console.log(clienteData);
  //           return clienteData; // Aquí puedes modificar según lo que necesites devolver
  //         });
  //         resolve(mappedData);
  //       },
  //       error => {
  //         console.error('Error al obtener empleados mapeados: ', error);
  //         reject(error);
  //       }
  //     );
  //   });
  // }

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

}



