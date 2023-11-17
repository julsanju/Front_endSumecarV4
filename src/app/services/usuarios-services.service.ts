import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuarios } from '../Interfaces/usuarios';
@Injectable({
  providedIn: 'root'
})
export class UsuariosServicesService {

  private ApiUrl = 'http://localhost:5171/api/usuarios/obtener'
  constructor(private http : HttpClient) { }

  obtenerUsuarios(): Observable<Usuarios[]>{
    return this.http.get<Usuarios[]>(this.ApiUrl);
  }
}
