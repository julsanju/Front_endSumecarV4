import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Dashboard } from '../Interfaces/dashboard';

export interface ApiError {
  Message: string;
  StatusCode?: number;
}

@Injectable({
  providedIn: 'any'
})
export class DashboardServicesService {

  private localIP = '192.168.0.51';
  private externalIP = '181.129.199.174';
  // Change to use local IP by default
  private baseUrl: string = `http://${this.localIP}:5107/api/Dashboard`;
  
  private apiUrlMontados: string = '';
  private apiUrl: string = '';
  private apiUrlPendintes: string = '';
  private apiurlFinalizados: string = '';
  
  constructor(private http: HttpClient) {
    // Initialize with default values
    this.initializeUrls();
    
    // Detect network and update URLs if needed
    this.detectNetwork().then(isLocal => {
      if (!isLocal) {
        // Only change to external if local network is not available
        this.baseUrl = `http://${this.externalIP}:5107/api/Dashboard`;
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
    this.apiUrlMontados = `${this.baseUrl}/Pedidos_montados`;
    this.apiUrl = `${this.baseUrl}/mostrar_graficoGeneral/{username}/{rol}/{movimiento}`;
    this.apiUrlPendintes = `${this.baseUrl}/Pedidos_pendientes/{usuario}/{opcion}`;
    this.apiurlFinalizados = `${this.baseUrl}/Pedidos_finalizados`;
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
    console.error('Error in dashboard service:', errorMessage);
    return throwError(() => ({ Message: errorMessage }));
  }

  //obtener Pedidos y graficos
  obtenerDatos(username: string, rol: string, movimiento: string): Observable<Dashboard[]> {
    const url = this.apiUrl.replace('{username}', username).replace('{rol}', rol).replace('{movimiento}', movimiento);
    return this.http.get<Dashboard[]>(url)
      .pipe(catchError(this.handleError));
  }
  
  //obtener pedidos confirmados
  obtenerConfirmados(): Observable<Dashboard[]> {
    return this.http.get<Dashboard[]>(this.apiUrlMontados)
      .pipe(catchError(this.handleError));
  }

  //obtener pedidos pendientes
  obtenerPendientes(usuario: string, opcion: string): Observable<Dashboard[]> {
    return this.http.get<Dashboard[]>(this.apiUrlPendintes.replace('{usuario}', usuario).replace('{opcion}', opcion))
      .pipe(catchError(this.handleError));
  }

  //obtener Pedidos Finalizados
  obtenerFinalizados(): Observable<Dashboard[]> {
    return this.http.get<Dashboard[]>(this.apiurlFinalizados)
      .pipe(catchError(this.handleError));
  }
}
