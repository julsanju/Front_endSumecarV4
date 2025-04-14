import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Correo } from '../Interfaces/correo';
import { UsuariosView } from '../Interfaces/usuarios-view';
import { DetalleDetallePeticionModel } from '../Interfaces/detalle-detalle-peticion-model';
import { DetallePeticionModel } from '../Interfaces/detalle-peticion-model';

export interface ApiError {
  Message: string;
  StatusCode?: number;
}

@Injectable({
  providedIn: 'any'
})
export class EnvioCorreosService {

  private localIP = '192.168.0.51';
  private externalIP = '181.129.199.174';
  // Change to use local IP by default
  private baseUrl: string = `http://${this.localIP}:5107/api`;
  private apiUrl: string = '';
  
  constructor(private http: HttpClient) {
    // Initialize with default values (now using local IP)
    this.initializeUrls();
    
    // Detect network and update URLs if needed - only switch to external if local fails
    this.detectNetwork().then(isLocal => {
      if (!isLocal) {
        // Only change to external if local network is not available
        this.baseUrl = `http://${this.externalIP}:5107/api`;
        this.initializeUrls();
        console.log('Local network not available, using external IP configuration');
      } else {
        console.log('Using local network configuration');
      }
    }).catch((error) => {
      // If detection fails, stay with local IP as default
      console.log('Network detection failed, staying with local IP', error);
    });
  }

  // Initialize URLs based on the determined base URL
  private initializeUrls(): void {
    this.apiUrl = `${this.baseUrl}/agregar_peticion/`;
  }

  // Function to detect if we're on the local network
  // Improved network detection function
  private async detectNetwork(): Promise<boolean> {
    try {
      console.log('Attempting to connect to local network...');
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);
      
      const response = await fetch(`http://${this.localIP}:5107/api/health`, { 
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

  // Helper method for error handling
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error('Error in email service:', errorMessage);
    return throwError(() => ({ Message: errorMessage }));
  }

  addPeticion(data: DetallePeticionModel[], usuario: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(this.apiUrl + usuario, data, { headers })
      .pipe(catchError(this.handleError));
  }
}
