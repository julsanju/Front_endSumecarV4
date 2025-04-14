import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError  } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Login } from '../Interfaces/login';
import { MensajeError } from '../Interfaces/mensaje-error';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {
  
  private localIP = '192.168.0.51';
  private externalIP = '181.129.199.174';
  // Change to use local IP by default
  private apiUrl: string = `http://${this.localIP}:5000/api/login/iniciar_sesion`;
  
  constructor(private http: HttpClient) {
    // Detect network and update URLs if needed - only switch to external if local fails
    this.detectNetwork().then(isLocal => {
      if (!isLocal) {
        // Only change to external if local network is not available
        this.apiUrl = `http://${this.externalIP}:5000/api/login/iniciar_sesion`;
        console.log('Local network not available, using external IP configuration');
      } else {
        console.log('Using local network configuration');
      }
    }).catch((error) => {
      // If detection fails, stay with local IP as default
      console.log('Network detection failed, staying with local IP', error);
    });
  }

  // Improved network detection function
  private async detectNetwork(): Promise<boolean> {
    try {
      console.log('Attempting to connect to local network...');
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);
      
      const response = await fetch(`http://${this.localIP}:5000/api/health`, { 
        method: 'HEAD',
        mode: 'no-cors',
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      console.log('Successfully connected to local network');
      return true; // If we get here, local network is available
    } catch (error) {
      console.log('Failed to connect to local network, will use external IP');
      return false; // If error, we're not on local network
    }
  }

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
