import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Productos } from '../Interfaces/productos';
@Injectable({
  providedIn: 'root'
})
export class ProductsServicesService {
  
  //mostrar todos los productos
  private apiUrl = 'http://localhost:5106/api/productos/obtener';
  private UrlPendientes = 'http://localhost:5106/api/productos/filtrar/'; 
  private UrlFinalizados = 'http://localhost:5106/api/productos/filtrar_finalizados/'; 

  constructor(private http : HttpClient) { }
  //obtener todos los productos
  obtenerProductos(): Observable<Productos[]>{
    return this.http.get<Productos[]>(this.apiUrl);
  }

  //obtener productos confirmados
  obtenerFiltrado(username : string) : Observable<Productos[]>{
    return this.http.get<Productos[]>(this.UrlPendientes + username);
  }

  //obtener productos confirmados
  obtenerFinalizado(username : string) : Observable<Productos[]>{
    return this.http.get<Productos[]>(this.UrlFinalizados + username);
  }
}
