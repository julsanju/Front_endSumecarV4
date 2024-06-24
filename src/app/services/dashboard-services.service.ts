import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Dashboard } from '../Interfaces/dashboard';

@Injectable({
  providedIn: 'any'
})
export class DashboardServicesService {

  //local
  private apiUrlMontados = 'https://microservicio-sumecarventas.azurewebsites.net/api/Dashboard/Pedidos_montados';
  // private apiUrlPendintes = 'https://microservicio-sumecarventas.azurewebsites.net/api/Dashboard/Pedidos_pendientes';
  // private apiurlFinalizados = 'https://microservicio-sumecarventas.azurewebsites.net/api/Dashboard/Pedidos_finalizados';*/
  
  //azure
  //private apiUrl = 'https://microservicio-sumecarventas.azurewebsites.net/api/Dashboard/Pedidos_montados';
  //private apiUrl = 'https://microservicio-sumecarventas.azurewebsites.net/api/Dashboard/mostrar_graficoGeneral/{username}/{estado}/{movimiento}';
  private apiUrl = 'https://microservicio-sumecarventas.azurewebsites.net/api/Dashboard/mostrar_graficoGeneral/{username}/{rol}/{movimiento}';
  private apiUrlPendintes = 'https://microservicio-sumecarventas.azurewebsites.net/api/Dashboard/Pedidos_pendientes/{usuario}/{opcion}';
  private apiurlFinalizados = 'https://microservicio-sumecarventas.azurewebsites.net/api/Dashboard/Pedidos_finalizados';
  
  constructor(private http : HttpClient) { }

  //obtener Pedidos y graficos
  obtenerDatos(username:string, rol:string, movimiento:string): Observable<Dashboard[]>{
    const url = this.apiUrl.replace('{username}', username).replace('{rol}', rol).replace('{movimiento}', movimiento);
    return this.http.get<Dashboard[]>(url);
  }
  //obtener pedidos confirmados
  obtenerConfirmados(): Observable<Dashboard[]>{
    return this.http.get<Dashboard[]>(this.apiUrl);
  }

  //obtener pedidos pendientes
  obtenerPendientes(usuario:string, opcion:string): Observable<Dashboard[]>{
    return this.http.get<Dashboard[]>(this.apiUrlPendintes.replace('{usuario}', usuario).replace('{opcion}', opcion));
  }

  //obtener Pedidos Finalizados
  obtenerFinalizados(): Observable<Dashboard[]>{
    return this.http.get<Dashboard[]>(this.apiurlFinalizados);
  }
}
