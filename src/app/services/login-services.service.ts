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
  private apiUrl = 'https://sumecarventas.azurewebsites.net/api/login/iniciar_sesion'
  
  private peticionUrl = 'http://localhost:5171/api/login/peticion_cambio_contrasena/';
  private dataUpdateEstado = 'http://localhost:5171/api/login/peticion_cambio_contrasena/';
  private validarUrl = 'http://localhost:5171/api/login/obtener_usuario/'
  private CambiarCoUrl = 'http://localhost:5171/api/login/cambio_contrasena/{correo}'
  private declineUpdatePassword = 'http://localhost:5171/api/login/declineUpdate_password/'
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
  peticionCorreo(correo: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(this.peticionUrl + correo, { headers });
  }

  //validar estado del correo
  ValidarEstado(correo:string): Observable<any>{
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' })
    return this.http.get(this.validarUrl + correo, { headers });
  }
  
  CambiarContrasena(c:Contrasena, correo:string): Observable<any>{
    const headers = new HttpHeaders ({'Content-Type': 'application/json'})
    return this.http.put(this.CambiarCoUrl.replace('{correo}',correo),c, {headers});
  }
  //cancelar el proceso de cambio de contraseña
  declineUpdate(correo: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put(this.declineUpdatePassword + correo, { headers });
  }
}

