import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, of, throwError, from } from 'rxjs';
import { switchMap } from 'rxjs/operators';

export interface ApiError {
  Message: string;
  StatusCode?: number;
}

declare var grecaptcha: any;

@Injectable({
  providedIn: 'any'
})
export class CaptchaServicesService {

  private localIP = '192.168.0.51';
  private externalIP = '181.129.199.174';
  private baseUrl: string = '';
  private apiUrl: string = '';

  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) {
    // baseUrl se asigna dinámicamente antes de cada petición
  }

  // Detecta si estamos en red local o externa
  private async detectNetwork(): Promise<void> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);

      await fetch(`http://${this.localIP}:5000/api/health`, {
        method: 'HEAD',
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      this.baseUrl = `http://${this.localIP}:5000/api/login`;
    } catch {
      this.baseUrl = `http://${this.externalIP}:5000/api/login`;
    }

    this.apiUrl = `${this.baseUrl}/validationCaptcha`;
  }

  // Prepara la URL y ejecuta la llamada
  private prepareRequest<T>(callback: () => Observable<T>): Observable<T> {
    return from(this.detectNetwork()).pipe(switchMap(() => callback()));
  }

  // Manejo de errores para reCAPTCHA
  private handleError(error: HttpErrorResponse): Observable<boolean> {
    let errorMessage = 'An unknown error occurred';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error('Error al validar reCAPTCHA:', errorMessage);
    return of(false);
  }

  // Validación del token reCAPTCHA
  verify(token: string): Observable<boolean> {
    const body = { Token: token };
    return this.prepareRequest(() =>
      this.http.post<boolean>(this.apiUrl, body, this.httpOptions)
        .pipe(
          map(response => response),
          catchError(this.handleError.bind(this))
        )
    );
  }
}
