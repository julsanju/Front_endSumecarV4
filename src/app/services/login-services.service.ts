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
  private localIP = '192.168.0.51';
  private externalIP = '181.129.199.174';
  // Change to use local IP by default
  private baseUrl: string = `http://${this.localIP}:5000/api/login`;
  
  private apiUrl: string = '';
  private peticionUrl: string = '';
  private dataUpdateEstado: string = '';
  private validarUrl: string = '';
  private CambiarCoUrl: string = '';
  private declineUpdatePassword: string = '';
  private declineEmailConfirmation: string = '';
  
  constructor(private http: HttpClient) {
    // Initialize URLs with default values
    this.initializeUrls();
    
    // Detect network and update URLs if needed - only switch to external if local fails
    this.detectNetwork().then(isLocal => {
      if (!isLocal) {
        // Only change to external if local network is not available
        this.baseUrl = `http://${this.externalIP}:5000/api/login`;
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

  // Initialize all URLs based on the determined base URL
  private initializeUrls(): void {
    this.apiUrl = `${this.baseUrl}/iniciar_sesion`;
    this.peticionUrl = `${this.baseUrl}/peticion_cambio_contrasena/`;
    this.dataUpdateEstado = `${this.baseUrl}/peticion_cambio_contrasena/`;
    this.validarUrl = `${this.baseUrl}/obtener_usuario/`;
    this.CambiarCoUrl = `${this.baseUrl}/cambio_contrasena/{correo}`;
    this.declineUpdatePassword = `${this.baseUrl}/declineUpdate_password/`;
    this.declineEmailConfirmation = `${this.baseUrl}/declineEmailConfirmation/`;
  }

  // Function to detect if we're on the local network
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
  
  declineEmail_Confirmation(usuario: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put(this.declineEmailConfirmation + usuario, { headers });
  }
}

