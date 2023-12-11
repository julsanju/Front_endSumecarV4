import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Dashboard } from '../Interfaces/dashboard';

@Injectable({
  providedIn: 'any'
})
export class DashboardServicesService {

  private apiUrl = 'http://localhost:5107/api/Dashboard/Pedidos_montados';
  private apiUrlPendintes = 'http://localhost:5107/api/Dashboard/Pedidos_pendientes';
  private apiurlFinalizados = 'http://localhost:5107/api/Dashboard/Pedidos_finalizados';
  
  constructor(private http : HttpClient) { }

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
