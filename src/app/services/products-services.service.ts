import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Productos } from '../Interfaces/productos';
@Injectable({
  providedIn: 'any'
})
export class ProductsServicesService {
  
  //mostrar todos los productos
  private apiUrl = 'https://microservicio-sumecar-ventas.azurewebsites.net/api/productos/obtener';
  private UrlPendientes = 'https://microservicio-sumecar-ventas.azurewebsites.net/api/productos/filtrar/'; 
  private UrlFinalizados = 'https://microservicio-sumecar-ventas.azurewebsites.net/api/productos/filtrar_finalizados/'; 
  private UrlProductosFinalizados = 'https://microservicio-sumecar-ventas.azurewebsites.net/api/productos/insertar/';
  private UrlPendientesEmpleado = 'https://microservicio-sumecar-ventas.azurewebsites.net/api/productos/filtrar_empleado';
  private UrlFinalizadosEmpleado = 'https://microservicio-sumecar-ventas.azurewebsites.net/api/productos/filtrar_finalizadosEmpleado';
  private ApiUrlFinalizarPeticionProducto = 'https://microservicio-sumecar-ventas.azurewebsites.net/api/productos/finalizar_peticion_productos/';
  constructor(private http : HttpClient) { }
  //obtener todos los productos
  obtenerProductos(): Observable<Productos[]>{
    return this.http.get<Productos[]>(this.apiUrl);
  }

  //obtener productos confirmados
  obtenerFiltrado(username : string) : Observable<Productos[]>{
    return this.http.get<Productos[]>(this.UrlPendientes + username);
  }

  //obtener productos confirmados como empleado
  obtenerFiltradoEmpleado() : Observable<Productos[]>{
    return this.http.get<Productos[]>(this.UrlPendientesEmpleado);
  }
  //obtener productos finalizados
  obtenerFinalizado(username : string) : Observable<Productos[]>{
    return this.http.get<Productos[]>(this.UrlFinalizados + username);
  }

  //metodo para obtener finalizado como empleado
  obtenerFinalizadoEmpleado() : Observable<Productos[]>{
    return this.http.get<Productos[]>(this.UrlFinalizadosEmpleado);
  }

  //confirmar productos
    confirmarProductos(productos: Productos[], username: string): Observable<any>{
      const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

      return this.http.post(this.UrlProductosFinalizados + username, productos, { headers });
    }
    
    FinalizarPeticionProducto(id:number): Observable<any>{
      const headers = new HttpHeaders ({'Content-Type': 'application/json'})
      return this.http.put(this.ApiUrlFinalizarPeticionProducto + id, {headers});
    }
}
