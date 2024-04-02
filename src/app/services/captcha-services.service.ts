import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, of, throwError } from 'rxjs';
import { environment } from '../environments/environment';

declare var grecaptcha: any;

@Injectable({
  providedIn: 'any'
})
export class CaptchaServicesService {
  private apiUrl = 'https://sumecarventas.azurewebsites.net/api/login/validationCaptcha';
  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) { }

  verify(token: string): Observable<boolean> {
    const body = { Token: token }; 
    return this.http.post<boolean>(this.apiUrl, body, this.httpOptions).pipe(
      map(response => response),
      catchError(error => {
        console.error('Error al validar reCAPTCHA:', error);
        return of(false); // Devuelve un Observable con el valor false en caso de error
      })
    );
  }

}
