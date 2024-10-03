import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { Productos } from '../Interfaces/productos';
import { DatosAccordeon } from '../Interfaces/datosAccordeon';
import { DocumentosModel } from '../Interfaces/documentos-model';
@Injectable({
  providedIn: 'any'
})
export class ProductsServicesService {
  private productosConfirmadosSubject = new Subject<void>();

  //mostrar todos los productos
  private UrlPendientes = 'https://microservicio-sumecarventas.azurewebsites.net/api/productos/filtrar/';
  private UrlAccordion = 'https://microservicio-sumecarventas.azurewebsites.net/api/productos/filtrar_pedidos_accordion';
  private UrlAccordionCliente = 'https://microservicio-sumecarventas.azurewebsites.net/api/productos/filtrar_pedidos_accordion/';
  private UrlAccordionFinalizada = 'https://microservicio-sumecarventas.azurewebsites.net/api/productos/filtrar_pedidos_accordion_finalizada';
  private UrlAccordionFinalizadaCliente = 'https://microservicio-sumecarventas.azurewebsites.net/api/productos/filtrar_pedidos_accordion_finalizada/';

  private UrlFinalizados = 'https://microservicio-sumecarventas.azurewebsites.net/api/productos/filtrar_finalizados/';
  private UrlProductosFinalizados = 'https://microservicio-sumecarventas.azurewebsites.net/api/productos/insertar/';
  private UrlPendientesEmpleado = 'https://microservicio-sumecarventas.azurewebsites.net/api/productos/filtrar_empleado';
  private UrlFinalizadosEmpleado = 'https://microservicio-sumecarventas.azurewebsites.net/api/productos/filtrar_finalizadosEmpleado';
  private ApiUrlFinalizarPeticionProducto = 'https://microservicio-sumecarventas.azurewebsites.net/api/productos/finalizar_peticion_productos/';
  //local
  private apiUrl = 'https://microservicio-sumecarventas.azurewebsites.net/api/productos/obtener';
  private ApiUrlEliminarPedido = 'https://microservicio-sumecarventas.azurewebsites.net/api/productos/eliminar/'
  //DocumentHistory
  private apiUrlDocumentHistory = 'https://sumecarventas.azurewebsites.net/api/History/{username}/{opcion}'

  constructor(private http: HttpClient) { }
  //obtener todos los productos
  obtenerProductos(): Observable<Productos[]> {
    return this.http.get<Productos[]>(this.apiUrl);
  }

  //obtener productos confirmados
  obtenerFiltrado(username: string): Observable<Productos[]> {
    return this.http.get<Productos[]>(this.UrlPendientes + username);
  }

  //obtener productos confirmados para accordion para empleado y admin
  obtenerDatosAccordeon(): Observable<DatosAccordeon[]> {
    return this.http.get<DatosAccordeon[]>(this.UrlAccordion);
  }

  //obtener productos confirmados para accordion para cliente
  obtenerDatosAccordeonCliente(username: string): Observable<DatosAccordeon[]> {
    return this.http.get<DatosAccordeon[]>(this.UrlAccordionCliente + username);
  }

  //obtener productos confirmados para accordion para cliente
  obtenerDatosAccordeonFinalizada(): Observable<DatosAccordeon[]> {
    return this.http.get<DatosAccordeon[]>(this.UrlAccordionFinalizada);
  }

  //obtener productos confirmados para accordion para cliente
  obtenerDatosAccordeonFinalizadaCliente(username: string): Observable<DatosAccordeon[]> {
    return this.http.get<DatosAccordeon[]>(this.UrlAccordionFinalizadaCliente + username);
  }

  //obtener productos confirmados como empleado
  obtenerFiltradoEmpleado(): Observable<Productos[]> {
    return this.http.get<Productos[]>(this.UrlPendientesEmpleado);
  }
  //obtener productos finalizados
  obtenerFinalizado(username: string): Observable<Productos[]> {
    return this.http.get<Productos[]>(this.UrlFinalizados + username);
  }

  //metodo para obtener finalizado como empleado
  obtenerFinalizadoEmpleado(): Observable<Productos[]> {
    return this.http.get<Productos[]>(this.UrlFinalizadosEmpleado);
  }

  //confirmar productos
  confirmarProductos(productos: Productos[], username: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post(this.UrlProductosFinalizados + username, productos, { headers });
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
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' })
    return this.http.put(this.ApiUrlFinalizarPeticionProducto + id, { headers });
  }

  EliminarPedidoProducto(numero_orden:number): Observable<any> {
    return this.http.delete(this.ApiUrlEliminarPedido + numero_orden);
  }

  SeteoDatosHistorialDocumentos(username:string, opcion:string): Observable<DocumentosModel[]> {
    const url = this.apiUrlDocumentHistory.replace('{username}', username).replace('{opcion}', opcion);  
    return this.http.get<DocumentosModel[]>(url);
  }
}
