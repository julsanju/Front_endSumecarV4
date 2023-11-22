import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Peticiones } from '../Interfaces/peticiones';
import { Empleado } from '../Interfaces/empleado';
@Injectable({
  providedIn: 'root'
})
export class PeticioneServicesService {

  private ApiUrl = 'http://localhost:5107/api/mostrar_peticiones_pendientes/';
  private ApiUrlFinalizados = 'http://localhost:5107/api/mostrar_peticiones_finalizados/';
  private ApiUrlFinalizarPeticion = 'http://localhost:5107/api/finalizar_peticion/';
  private ApiurlObtenerCorreo = 'http://localhost:5171/api/usuarios/obtener_empleado/';
  private APiUrlObtenerPendienteCliente = 'http://localhost:5107/api/mostrar_peticiones_pendientesC/';
  private APiUrlObtenerFinalizadoCliente = 'http://localhost:5107/api/mostrar_peticiones_finalizadosC/';
  constructor(private http : HttpClient) { }

  obtenerPendientes(correo:string): Observable<Peticiones[]>{
    return this.http.get<Peticiones[]>(this.ApiUrl + correo);
  }

  obtenerPendientesCliente(username:string): Observable<Peticiones[]>{
    return this.http.get<Peticiones[]>(this.APiUrlObtenerPendienteCliente + username);
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
