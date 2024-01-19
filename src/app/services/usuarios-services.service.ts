import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UsuariosView } from '../Interfaces/usuarios-view';
import { Empleado } from '../Interfaces/empleado';
import { Imagen } from '../Interfaces/imagen';
@Injectable({
  providedIn: 'any'
})
export class UsuariosServicesService {

  private ApiUrl = 'https://sumecarventas.azurewebsites.net/api/usuarios/obtener'
  private ApiUrlEmpleado = 'https://sumecarventas.azurewebsites.net/api/usuarios/obtener_todosUsuarios'; 
  private ApiUrlImagenUser = 'https://sumecarventas.azurewebsites.net/api/usuarios/imagen/';   
  private ApiUrlFiltroEmpleado = 'https://sumecarventas.azurewebsites.net/api/usuarios/obtener_empleado_admin'
  constructor(private http : HttpClient) { }

  obtenerUsuarios(): Observable<UsuariosView[]>{
    return this.http.get<UsuariosView[]>(this.ApiUrl);
  }

  obtenerEmpleado(): Observable<Empleado[]>{
    return this.http.get<Empleado[]>(this.ApiUrlEmpleado);
  }

  filtroEmpleado_admin(): Observable<Empleado[]>{
    return this.http.get<Empleado[]>(this.ApiUrlFiltroEmpleado);
  }

  obtenerImagenUser(username :string): Observable<string>{
    return this.http.get(this.ApiUrlImagenUser + username, { responseType: 'text' });
  }

  
}
