import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, Subject, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
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
  // Change default to use local IP instead of external
  private baseUrl5107: string = `http://${this.localIP}:5107/api`;
  private baseUrl5000: string = `http://${this.localIP}:5000/api`;

  //mostrar todos los productos
  private UrlPendientes: string = '';
  private UrlAccordion: string = '';
  private UrlAccordionCliente: string = '';
  private UrlAccordionFinalizada: string = '';
  private UrlAccordionFinalizadaCliente: string = '';
  private UrlFinalizados: string = '';
  private UrlProductosFinalizados: string = '';
  private UrlPendientesEmpleado: string = '';
  private UrlFinalizadosEmpleado: string = '';
  private ApiUrlFinalizarPeticionProducto: string = '';
  private apiUrl: string = '';
  private ApiUrlEliminarPedido: string = '';
  private apiUrlDocumentHistory: string = '';

  constructor(private http: HttpClient) {
    // Initialize with default values (now using local IP)
    this.initializeUrls();
    
    // Detect network and update URLs if needed - only switch to external if local fails
    this.detectNetwork().then(isLocal => {
      if (!isLocal) {
        // Only change to external if local network is not available
        this.baseUrl5107 = `http://${this.externalIP}:5107/api`;
        this.baseUrl5000 = `http://${this.externalIP}:5000/api`;
        this.initializeUrls();
        console.log('Local network not available, using external IP configuration');
      } else {
        console.log('Using local network configuration');
      }
    }).catch((error) => {
      // If detection fails, stay with local IP as default
      console.log('Network detection failed, staying with local IP', error);
    });
  }

  // Initialize URLs based on the determined base URL
  private initializeUrls(): void {
    this.UrlPendientes = `${this.baseUrl5107}/productos/filtrar/`;
    this.UrlAccordion = `${this.baseUrl5107}/productos/filtrar_pedidos_accordion`;
    this.UrlAccordionCliente = `${this.baseUrl5107}/productos/filtrar_pedidos_accordion/`;
    this.UrlAccordionFinalizada = `${this.baseUrl5107}/productos/filtrar_pedidos_accordion_finalizada`;
    this.UrlAccordionFinalizadaCliente = `${this.baseUrl5107}/productos/filtrar_pedidos_accordion_finalizada/`;
    this.UrlFinalizados = `${this.baseUrl5107}/productos/filtrar_finalizados/`;
    this.UrlProductosFinalizados = `${this.baseUrl5107}/productos/insertar/`;
    this.UrlPendientesEmpleado = `${this.baseUrl5107}/productos/filtrar_empleado`;
    this.UrlFinalizadosEmpleado = `${this.baseUrl5107}/productos/filtrar_finalizadosEmpleado`;
    this.ApiUrlFinalizarPeticionProducto = `${this.baseUrl5107}/productos/finalizar_peticion_productos/`;
    this.apiUrl = `${this.baseUrl5107}/productos/obtener`;
    this.ApiUrlEliminarPedido = `${this.baseUrl5107}/productos/eliminar/`;
    this.apiUrlDocumentHistory = `${this.baseUrl5000}/History/{username}/{opcion}`;
  }

  
  // Function to detect if we're on the local network
  private async detectNetwork(): Promise<boolean> {
    try {
      console.log('Attempting to connect to local network...');
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);
      
      const response = await fetch(`http://${this.localIP}:5107/api/health`, { 
        method: 'HEAD',
        mode: 'no-cors',
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      console.log('Successfully connected to local network');
      return true; // If we get here, local network is available
    } catch (error) {
      console.log('Failed to connect to local network, will use external IP');
      return false; // If error, we're not on local network
    }
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

  //obtener todos los productos
  obtenerProductos(): Observable<Productos[]> {
    return this.http.get<Productos[]>(this.apiUrl)
      .pipe(catchError(this.handleError));
  }

  //obtener productos confirmados
  obtenerFiltrado(username: string): Observable<Productos[]> {
    return this.http.get<Productos[]>(this.UrlPendientes + username)
      .pipe(catchError(this.handleError));
  }

  //obtener productos confirmados para accordion para empleado y admin
  obtenerDatosAccordeon(): Observable<DatosAccordeon[]> {
    return this.http.get<DatosAccordeon[]>(this.UrlAccordion)
      .pipe(catchError(this.handleError));
  }

  //obtener productos confirmados para accordion para cliente
  obtenerDatosAccordeonCliente(username: string): Observable<DatosAccordeon[]> {
    return this.http.get<DatosAccordeon[]>(this.UrlAccordionCliente + username)
      .pipe(catchError(this.handleError));
  }

  //obtener productos confirmados para accordion para cliente
  obtenerDatosAccordeonFinalizada(): Observable<DatosAccordeon[]> {
    return this.http.get<DatosAccordeon[]>(this.UrlAccordionFinalizada)
      .pipe(catchError(this.handleError));
  }

  //obtener productos confirmados para accordion para cliente
  obtenerDatosAccordeonFinalizadaCliente(username: string): Observable<DatosAccordeon[]> {
    return this.http.get<DatosAccordeon[]>(this.UrlAccordionFinalizadaCliente + username)
      .pipe(catchError(this.handleError));
  }

  //obtener productos confirmados como empleado
  obtenerFiltradoEmpleado(): Observable<Productos[]> {
    return this.http.get<Productos[]>(this.UrlPendientesEmpleado)
      .pipe(catchError(this.handleError));
  }
  
  //obtener productos finalizados
  obtenerFinalizado(username: string): Observable<Productos[]> {
    return this.http.get<Productos[]>(this.UrlFinalizados + username)
      .pipe(catchError(this.handleError));
  }

  //metodo para obtener finalizado como empleado
  obtenerFinalizadoEmpleado(): Observable<Productos[]> {
    return this.http.get<Productos[]>(this.UrlFinalizadosEmpleado)
      .pipe(catchError(this.handleError));
  }

  //confirmar productos
  confirmarProductos(productos: Productos[], username: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(this.UrlProductosFinalizados + username, productos, { headers })
      .pipe(catchError(this.handleError));
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
    return this.http.put(this.ApiUrlFinalizarPeticionProducto + id, {}, { headers })
      .pipe(catchError(this.handleError));
  }

  EliminarPedidoProducto(numero_orden: number): Observable<any> {
    return this.http.delete(this.ApiUrlEliminarPedido + numero_orden)
      .pipe(catchError(this.handleError));
  }

  SeteoDatosHistorialDocumentos(username: string, opcion: string): Observable<DocumentosModel[]> {
    const url = this.apiUrlDocumentHistory.replace('{username}', username).replace('{opcion}', opcion);  
    return this.http.get<DocumentosModel[]>(url)
      .pipe(catchError(this.handleError));
  }
}
