import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { Correo } from '../Interfaces/correo';
import { UsuariosView } from '../Interfaces/usuarios-view';
import { DetalleDetallePeticionModel } from '../Interfaces/detalle-detalle-peticion-model';
import { DetallePeticionModel } from '../Interfaces/detalle-peticion-model';

@Injectable({
  providedIn: 'any'
})
export class EnvioCorreosService {

  // private apiUrl = 'https://microservicio-sumecarventas.azurewebsites.net/api/agregar_peticion/'
  private apiUrl = 'https://microservicio-sumecarventas.azurewebsites.net/api/agregar_peticion/'
  constructor(private http: HttpClient) {}

  addPeticion(data : DetallePeticionModel[], usuario:string): Observable<any>{
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(this.apiUrl + usuario, data, { headers });
  }
}
