import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UsuariosView } from '../Interfaces/usuarios-view';
import { Empleado } from '../Interfaces/empleado';
@Injectable({
  providedIn: 'root'
})
export class UsuariosServicesService {

  private ApiUrl = 'http://localhost:5171/api/usuarios/obtener'
  private ApiUrlEmpleado = 'http://localhost:5171/api/usuarios/obtener_empleado';  
  constructor(private http : HttpClient) { }

  obtenerUsuarios(): Observable<UsuariosView[]>{
    return this.http.get<UsuariosView[]>(this.ApiUrl);
  }

  obtenerEmpleado(): Observable<Empleado[]>{
    return this.http.get<Empleado[]>(this.ApiUrlEmpleado);
  }
}
