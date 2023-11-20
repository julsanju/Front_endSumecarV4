import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UsuariosView } from '../Interfaces/usuarios-view';
@Injectable({
  providedIn: 'root'
})
export class UsuariosServicesService {

  private ApiUrl = 'http://localhost:5171/api/usuarios/obtener'
  constructor(private http : HttpClient) { }

  obtenerUsuarios(): Observable<UsuariosView[]>{
    return this.http.get<UsuariosView[]>(this.ApiUrl);
  }
}
