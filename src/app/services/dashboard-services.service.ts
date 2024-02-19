import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Dashboard } from '../Interfaces/dashboard';

@Injectable({
  providedIn: 'any'
})
export class DashboardServicesService {

  //local
  /*private apiUrl = 'http://localhost:5107/api/Dashboard/Pedidos_montados';
  private apiUrlPendintes = 'http://localhost:5107/api/Dashboard/Pedidos_pendientes';
  private apiurlFinalizados = 'http://localhost:5107/api/Dashboard/Pedidos_finalizados';*/
  
  //azure
  //private apiUrl = 'https://microservicio-sumecarventas.azurewebsites.net/api/Dashboard/Pedidos_montados';
  private apiUrl = 'http://localhost:5107/api/Dashboard/mostrar_grafico/{username}/{estado}/{movimiento}';
  private apiUrlPendintes = 'https://microservicio-sumecarventas.azurewebsites.net/api/Dashboard/Pedidos_pendientes';
  private apiurlFinalizados = 'https://microservicio-sumecarventas.azurewebsites.net/api/Dashboard/Pedidos_finalizados';
  
  constructor(private http : HttpClient) { }

  //obtener Pedidos y graficos
  obtenerDatos(username:string, estado:string, movimiento:string): Observable<Dashboard[]>{
    const url = this.apiUrl.replace('{username}', username).replace('{estado}', estado).replace('{movimiento}', movimiento);
    return this.http.get<Dashboard[]>(url);
  }
  //obtener pedidos confirmados
  obtenerConfirmados(): Observable<Dashboard[]>{
    return this.http.get<Dashboard[]>(this.apiUrl);
  }

  //obtener pedidos pendientes
  obtenerPendientes(): Observable<Dashboard[]>{
    return this.http.get<Dashboard[]>(this.apiUrlPendintes);
  }

  //obtener Pedidos Finalizados
  obtenerFinalizados(): Observable<Dashboard[]>{
    return this.http.get<Dashboard[]>(this.apiurlFinalizados);
  }
}
