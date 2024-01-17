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
  private ApiUrlEmpleado = 'https://sumecarventas.azurewebsites.net/api/usuarios/obtener_todosEmpleado'; 
  private ApiUrlImagenUser = 'https://sumecarventas.azurewebsites.net/api/usuarios/imagen/';   
  
  constructor(private http : HttpClient) { }

  obtenerUsuarios(): Observable<UsuariosView[]>{
    return this.http.get<UsuariosView[]>(this.ApiUrl);
  }

  obtenerEmpleado(): Observable<Empleado[]>{
    return this.http.get<Empleado[]>(this.ApiUrlEmpleado);
  }

  obtenerImagenUser(username :string): Observable<string>{
    return this.http.get(this.ApiUrlImagenUser + username, { responseType: 'text' });
  }

  
}
