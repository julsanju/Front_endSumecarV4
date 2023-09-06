import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError  } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Login } from '../Interfaces/login';
import { MensajeError } from '../Interfaces/mensaje-error';
@Injectable({
  providedIn: 'root'
})
export class LoginServicesService {
  private apiUrl = 'http://localhost:5171/api/login/iniciar_sesion';
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
}

