import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, Subject, throwError, from } from 'rxjs'; // Importar 'from'
import { catchError, switchMap } from 'rxjs/operators'; // Importar 'switchMap'
import { Productos } from '../Interfaces/productos';
import { DatosAccordeon } from '../Interfaces/datosAccordeon';
import { DocumentosModel } from '../Interfaces/documentos-model';

export interface ApiError {
  Message: string;
  StatusCode?: number;
}

@Injectable({
  providedIn: 'any'
})
export class ProductsServicesService {
  private productosConfirmadosSubject = new Subject<void>();

  private localIP = '192.168.0.51';
  private externalIP = '181.129.199.174';
  // Base URLs se asignarán dinámicamente
  private baseUrl5107: string = '5107';
  private baseUrl5000: string = '5000';

  // Objeto para almacenar las URLs
  private urls = {
    pendientes: '',
    accordion: '',
    accordionCliente: '',
    accordionFinalizada: '',
    accordionFinalizadaCliente: '',
    finalizados: '',
    productosFinalizados: '',
    pendientesEmpleado: '',
    finalizadosEmpleado: '',
    finalizarPeticionProducto: '',
    obtenerProductos: '',
    eliminarPedido: '',
    documentHistory: ''
  };


  constructor(private http: HttpClient) {
    // La detección de red y la inicialización de URLs se harán antes de cada petición
  }

  // Inicializa las URLs basadas en las baseUrls determinadas
  private initializeUrls(): void {
     this.urls.pendientes = `${this.baseUrl5107}/productos/filtrar/`;
     this.urls.accordion = `${this.baseUrl5107}/productos/filtrar_pedidos_accordion`;
     this.urls.accordionCliente = `${this.baseUrl5107}/productos/filtrar_pedidos_accordion/`;
     this.urls.accordionFinalizada = `${this.baseUrl5107}/productos/filtrar_pedidos_accordion_finalizada`;
     this.urls.accordionFinalizadaCliente = `${this.baseUrl5107}/productos/filtrar_pedidos_accordion_finalizada/`;
     this.urls.finalizados = `${this.baseUrl5107}/productos/filtrar_finalizados/`;
     this.urls.productosFinalizados = `${this.baseUrl5107}/productos/insertar/`;
     this.urls.pendientesEmpleado = `${this.baseUrl5107}/productos/filtrar_empleado`;
     this.urls.finalizadosEmpleado = `${this.baseUrl5107}/productos/filtrar_finalizadosEmpleado`;
     this.urls.finalizarPeticionProducto = `${this.baseUrl5107}/productos/finalizar_peticion_productos/`;
     this.urls.obtenerProductos = `${this.baseUrl5107}/productos/obtener`;
     this.urls.eliminarPedido = `${this.baseUrl5107}/productos/eliminar/`;
     this.urls.documentHistory = `${this.baseUrl5000}/History/{username}/{opcion}`;

    
  }


  // Función para detectar si estamos en la red local
  private async detectNetwork(): Promise<void> {
      let isLocal5000 = false;
      let isLocal5107 = false;

      // Check Port 5000
      try {
        console.log('Intentando conectar a la red local (Productos - Puerto 5000)...');
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2000);
        await fetch(`http://${this.localIP}:5000/api/health`, { method: 'HEAD', signal: controller.signal });
        clearTimeout(timeoutId);
        this.baseUrl5000 = `http://${this.localIP}:5000/api`;
        isLocal5000 = true;
        console.log('Conectado exitosamente a la red local (Puerto 5000)');
      } catch (error) {
        this.baseUrl5000 = `http://${this.externalIP}:5000/api`;
        console.log('Fallo al conectar a la red local (Puerto 5000), se usará IP externa');
      }

      // Check Port 5107
      try {
        console.log('Intentando conectar a la red local (Productos - Puerto 5107)...');
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2000);
        await fetch(`http://${this.localIP}:5107/api/health`, { method: 'HEAD', mode: 'no-cors', signal: controller.signal });
        clearTimeout(timeoutId);
        this.baseUrl5107 = `http://${this.localIP}:5107/api`;
        isLocal5107 = true;
        console.log('Conectado exitosamente a la red local (Puerto 5107)');
      } catch (error) {
        this.baseUrl5107 = `http://${this.externalIP}:5107/api`;
        console.log('Fallo al conectar a la red local (Puerto 5107), se usará IP externa');
      }

      // Actualizar URLs después de determinar baseUrls
      this.initializeUrls();
  }

  // Prepara la petición asegurando que la detección de red se complete primero
  private prepareRequest<T>(callback: () => Observable<T>): Observable<T> {
    return from(this.detectNetwork()).pipe(switchMap(() => callback()));
  }

  // Helper method for error handling
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error('Error in products service:', errorMessage);
    return throwError(() => ({ Message: errorMessage }));
  }

  // Function to detect if we're on the local network - REMOVED (integrated into detectNetwork above)

  //obtener todos los productos
  obtenerProductos(): Observable<Productos[]> {
    return this.prepareRequest(() =>
      this.http.get<Productos[]>(this.urls.obtenerProductos)
        .pipe(catchError(this.handleError))
    );
  }

  //obtener productos confirmados
  obtenerFiltrado(username: string): Observable<Productos[]> {
    return this.prepareRequest(() =>
      this.http.get<Productos[]>(this.urls.pendientes + username)
        .pipe(catchError(this.handleError))
    );
  }

  //obtener productos confirmados para accordion para empleado y admin
  obtenerDatosAccordeon(): Observable<DatosAccordeon[]> {
    return this.prepareRequest(() =>
      this.http.get<DatosAccordeon[]>(this.urls.accordion)
        .pipe(catchError(this.handleError))
    );
  }

  //obtener productos confirmados para accordion para cliente
  obtenerDatosAccordeonCliente(username: string): Observable<DatosAccordeon[]> {
    return this.prepareRequest(() =>
      this.http.get<DatosAccordeon[]>(this.urls.accordionCliente + username)
        .pipe(catchError(this.handleError))
    );
  }

  //obtener productos confirmados para accordion para cliente
  obtenerDatosAccordeonFinalizada(): Observable<DatosAccordeon[]> {
     return this.prepareRequest(() =>
       this.http.get<DatosAccordeon[]>(this.urls.accordionFinalizada)
         .pipe(catchError(this.handleError))
     );
  }

  //obtener productos confirmados para accordion para cliente
  obtenerDatosAccordeonFinalizadaCliente(username: string): Observable<DatosAccordeon[]> {
     return this.prepareRequest(() =>
       this.http.get<DatosAccordeon[]>(this.urls.accordionFinalizadaCliente + username)
         .pipe(catchError(this.handleError))
     );
  }

  //obtener productos confirmados como empleado
  obtenerFiltradoEmpleado(): Observable<Productos[]> {
    return this.prepareRequest(() =>
      this.http.get<Productos[]>(this.urls.pendientesEmpleado)
        .pipe(catchError(this.handleError))
    );
  }

  //obtener productos finalizados
  obtenerFinalizado(username: string): Observable<Productos[]> {
    return this.prepareRequest(() =>
      this.http.get<Productos[]>(this.urls.finalizados + username)
        .pipe(catchError(this.handleError))
    );
  }

  //metodo para obtener finalizado como empleado
  obtenerFinalizadoEmpleado(): Observable<Productos[]> {
    return this.prepareRequest(() =>
      this.http.get<Productos[]>(this.urls.finalizadosEmpleado)
        .pipe(catchError(this.handleError))
    );
  }

  //confirmar productos
  confirmarProductos(productos: Productos[], username: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.prepareRequest(() =>
      this.http.post(this.urls.productosFinalizados + username, productos, { headers })
        .pipe(catchError(this.handleError))
    );
  }

  // Método para notificar que se han confirmado productos
  notificarProductosConfirmados() {
    this.productosConfirmadosSubject.next();
  }

  // Observable para que los componentes puedan suscribirse a la confirmación de productos
  productosConfirmadosObservable(): Observable<void> {
    return this.productosConfirmadosSubject.asObservable();
  }

  FinalizarPeticionProducto(id: number): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.prepareRequest(() =>
      this.http.put(this.urls.finalizarPeticionProducto + id, {}, { headers })
        .pipe(catchError(this.handleError))
    );
  }

  EliminarPedidoProducto(numero_orden: number): Observable<any> {
    return this.prepareRequest(() =>
      this.http.delete(this.urls.eliminarPedido + numero_orden)
        .pipe(catchError(this.handleError))
    );
  }

  SeteoDatosHistorialDocumentos(username: string, opcion: string): Observable<DocumentosModel[]> {
    const url = this.urls.documentHistory.replace('{username}', username).replace('{opcion}', opcion);
    return this.prepareRequest(() =>
      this.http.get<DocumentosModel[]>(url)
        .pipe(catchError(this.handleError))
    );
  }
}
