import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Peticiones } from '../Interfaces/peticiones';
import { Empleado } from '../Interfaces/empleado';
@Injectable({
  providedIn: 'any'
})
export class PeticioneServicesService {

  //private ApiUrl = 'https://microservicio-sumecarventas.azurewebsites.net/api/mostrar_peticiones_pendientes/';
  private ApiUrl = 'https://microservicio-sumecarventas.azurewebsites.net/api/mostrar_peticiones/{estado}/{username}';
  
  //private ApiUrlFinalizarPeticion = 'https://microservicio-sumecarventas.azurewebsites.net/api/finalizar_peticion/';
  private ApiUrlFinalizarPeticion = 'https://microservicio-sumecarventas.azurewebsites.net/api/finalizar_peticion/';
  private ApiurlObtenerCorreo = 'https://sumecarventas.azurewebsites.net/api/usuarios/obtener_empleado/';
  
  constructor(private http : HttpClient) { }

  ObtenerPeticiones(estado:string,username:string): Observable<Peticiones[]>{
    const url = this.ApiUrl.replace('{estado}', estado).replace('{username}', username);
    return this.http.get<Peticiones[]>(url);
  }

  
  FinalizarPeticion(id:number): Observable<any>{
    const headers = new HttpHeaders ({'Content-Type': 'application/json'})
    return this.http.put(this.ApiUrlFinalizarPeticion + id, {headers});
  }

  obtenerCorreo(username:string): Observable<Empleado[]>{
    return this.http.get<Empleado[]>(this.ApiurlObtenerCorreo + username);
  }
}
