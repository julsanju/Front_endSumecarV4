import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Usuarios } from '../Interfaces/usuarios'; // Asegúrate de importar correctamente la interfaz
import { Empleado } from '../Interfaces/empleado';
import { Usuariosxd } from '../Interfaces/usuariosxd';

export interface ApiError {
  Message: string;
  StatusCode?: number;
}

@Injectable({
  providedIn: 'any'
})
export class RegisterService {
  
  private localIP = '192.168.0.51';
  private externalIP = '181.129.199.174';
  // Change to use local IP by default
  private baseUrl: string = `http://${this.localIP}:5000/api`;
  
  private apiUrl: string = '';
  private apiUrlDataGoogle: string = '';
  private imagenUrl: string = '';
  private ApiUrlModificarEmpleado: string = '';
  
  constructor(private http: HttpClient) {
    // Initialize with default values (now using local IP)
    this.initializeUrls();
    
    // Detect network and update URLs if needed - only switch to external if local fails
    this.detectNetwork().then(isLocal => {
      if (!isLocal) {
        // Only change to external if local network is not available
        this.baseUrl = `http://${this.externalIP}:5000/api`;
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
    this.apiUrl = `${this.baseUrl}/usuarios/insertar/`;
    this.apiUrlDataGoogle = `${this.baseUrl}/usuarios/insertarDataGoogle/`;
    this.imagenUrl = `${this.baseUrl}/guardar_imagen`;
    this.ApiUrlModificarEmpleado = `${this.baseUrl}/usuarios/modificar_empleado`;
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
    console.error('Error in register service:', errorMessage);
    return throwError(() => ({ Message: errorMessage }));
  }

  registerUser(userData: FormData, username: string): Observable<any> {
    return this.http.post(this.apiUrl + username, userData)
      .pipe(catchError(this.handleError));
  }

  registerxd(userData: Usuariosxd, username: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(this.apiUrl + username, userData, { headers })
      .pipe(catchError(this.handleError));
  }
  
  registerUserWithDataGoogle(userData: FormData, uid: string): Observable<any> {
    return this.http.post(this.apiUrlDataGoogle + uid, userData)
      .pipe(catchError(this.handleError));
  }

  agregarImagen(imagen: FormData, httpOptions: { headers: HttpHeaders }): Observable<any> {
    return this.http.post<any>(this.imagenUrl, imagen, httpOptions)
      .pipe(catchError(this.handleError));
  }

  ModificarEmpleado(empleados: Empleado): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put(this.ApiUrlModificarEmpleado, empleados, { headers })
      .pipe(catchError(this.handleError));
  }
}

