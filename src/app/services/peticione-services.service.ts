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
  private ApiUrl = 'http://localhost:5107/api/mostrar_peticiones_pendientes/{estado}/{username}';
  private ApiUrlFinalizados = 'https://microservicio-sumecarventas.azurewebsites.net/api/mostrar_peticiones_finalizados/';
  //private ApiUrlFinalizarPeticion = 'https://microservicio-sumecarventas.azurewebsites.net/api/finalizar_peticion/';
  private ApiUrlFinalizarPeticion = 'http://localhost:5107/api/finalizar_peticion/';
  private ApiurlObtenerCorreo = 'https://sumecarventas.azurewebsites.net/api/usuarios/obtener_empleado/';
  private APiUrlObtenerPendienteCliente = 'https://microservicio-sumecarventas.azurewebsites.net/api/mostrar_peticiones_pendientesC/';
  private APiUrlObtenerFinalizadoCliente = 'https://microservicio-sumecarventas.azurewebsites.net/api/mostrar_peticiones_finalizadosC/';
  constructor(private http : HttpClient) { }

  obtenerPendientes(correo:string): Observable<Peticiones[]>{
    return this.http.get<Peticiones[]>(this.ApiUrl + correo);
  }

  obtenerPendientesCliente(estado:string,username:string): Observable<Peticiones[]>{
    const url = this.ApiUrl.replace('{estado}', estado).replace('{username}', username);
    return this.http.get<Peticiones[]>(url);
  }

  obtenerFinalizados(correo:string): Observable<Peticiones[]>{
    return this.http.get<Peticiones[]>(this.ApiUrlFinalizados + correo);
  }

  obtenerFinalizadosCliente(username:string): Observable<Peticiones[]>{
    return this.http.get<Peticiones[]>(this.APiUrlObtenerFinalizadoCliente + username);
  }

  FinalizarPeticion(id:number): Observable<any>{
    const headers = new HttpHeaders ({'Content-Type': 'application/json'})
    return this.http.put(this.ApiUrlFinalizarPeticion + id, {headers});
  }

  obtenerCorreo(username:string): Observable<Empleado[]>{
    return this.http.get<Empleado[]>(this.ApiurlObtenerCorreo + username);
  }
}
