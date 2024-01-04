import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { Correo } from '../Interfaces/correo';

@Injectable({
  providedIn: 'any'
})
export class EnvioCorreosService {

  private apiUrl = 'https://microservicio-sumecarventas.azurewebsites.net/api/agregar_peticion/'
  constructor(private http: HttpClient) {}

  addPeticion(data : Correo, usuario:string): Observable<any>{
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(this.apiUrl + usuario, data, { headers });
  }
}
