import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { Productos } from '../Interfaces/productos';
import { DatosAccordeon } from '../Interfaces/datosAccordeon';
@Injectable({
  providedIn: 'any'
})
export class ProductsServicesService {
  private productosConfirmadosSubject = new Subject<void>();

  //mostrar todos los productos
  //private apiUrl = 'http://localhost:5107/api/productos/obtener';
  private UrlPendientes = 'http://localhost:5107/api/productos/filtrar/';
  private UrlAccordion = 'http://localhost:5107/api/productos/filtrar_pedidos_accordion';
  private UrlAccordionCliente = 'http://localhost:5107/api/productos/filtrar_pedidos_accordion/';
  private UrlAccordionFinalizada = 'http://localhost:5107/api/productos/filtrar_pedidos_accordion_finalizada';
  private UrlAccordionFinalizadaCliente = 'http://localhost:5107/api/productos/filtrar_pedidos_accordion_finalizada/';

  private UrlFinalizados = 'http://localhost:5107/api/productos/filtrar_finalizados/';
  private UrlProductosFinalizados = 'http://localhost:5107/api/productos/insertar/';
  private UrlPendientesEmpleado = 'http://localhost:5107/api/productos/filtrar_empleado';
  private UrlFinalizadosEmpleado = 'http://localhost:5107/api/productos/filtrar_finalizadosEmpleado';
  private ApiUrlFinalizarPeticionProducto = 'http://localhost:5107/api/productos/finalizar_peticion_productos/';
  //local
  private apiUrl = 'http://localhost:5107/api/productos/obtener';
  /*private UrlPendientes = 'http://localhost:5107/api/productos/filtrar/'; 
  private UrlFinalizados = 'http://localhost:5107/api/productos/filtrar_finalizados/'; 
  private UrlProductosFinalizados = 'http://localhost:5107/api/productos/insertar/';
  private UrlPendientesEmpleado = 'http://localhost:5107/api/productos/filtrar_empleado';
  private UrlFinalizadosEmpleado = 'http://localhost:5107/api/productos/filtrar_finalizadosEmpleado';
  private ApiUrlFinalizarPeticionProducto = 'http://localhost:5107/api/productos/finalizar_peticion_productos/';*/
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
}
