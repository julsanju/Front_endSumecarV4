import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError  } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Login } from '../Interfaces/login';
import { MensajeError } from '../Interfaces/mensaje-error';
import { Contrasena } from '../Interfaces/contrasena';
@Injectable({
  providedIn: 'any'
})
export class LoginServicesService {
  private apiUrl = 'https://sumecar-ventas.azurewebsites.net/api/login/iniciar_sesion'
  
  private peticionUrl = 'https://sumecar-ventas.azurewebsites.net/api/login/peticion_cambio_contrasena/';
  private validarUrl = 'https://microservicio-sumecar-ventas.azurewebsites.net/api/login/obtener_usuario/'
  private CambiarCoUrl = 'https://microservicio-sumecar-ventas.azurewebsites.net/api/login/actualizar_contrasena/'
  constructor(private http: HttpClient) { }

  LoginValidation(userData: Login): Observable<any> {
    const headers = new HttpHeaders({'Content-Type': 'application/json'})

    return this.http.post(this.apiUrl, userData, { headers }).pipe(catchError(this.handleError));
    
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage: MensajeError = { Message: 'An error occurred' };
    if (error.error instanceof ErrorEvent) {
      // Client-side errors
      errorMessage.Message = JSON.parse(error.error.message);
    } else {
      // Server-side errors
      return throwError(error.error); // Devuelve solo el JSON de la respuesta del backend
    }
    return throwError(errorMessage);
  }

  
  //peticion para validar correo
  peticionCorreo(usuario: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(this.peticionUrl + usuario, { headers });
  }

  //validar estado del correo
  ValidarEstado(usuario:string): Observable<any>{
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' })
    return this.http.get(this.validarUrl + usuario, { headers });
  }
  
  CambiarContrasena(c:Contrasena, usuario:string): Observable<any>{
    const headers = new HttpHeaders ({'Content-Type': 'application/json'})
    return this.http.put(this.CambiarCoUrl + usuario, c, {headers});
  }
}

