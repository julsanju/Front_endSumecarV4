import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Productos } from '../Interfaces/productos';
@Injectable({
  providedIn: 'root'
})
export class ProductsServicesService {

  private apiUrl = 'http://localhost:5106/api/productos/obtener';
  constructor(private http : HttpClient) { }

  obtenerProductos(): Observable<Productos[]>{
    return this.http.get<Productos[]>(this.apiUrl);
  }
}
