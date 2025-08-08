import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, from } from 'rxjs'; // Importar 'from'
import { catchError, switchMap } from 'rxjs/operators'; // Importar 'switchMap'
import { Login } from '../Interfaces/login';
import { MensajeError } from '../Interfaces/mensaje-error';
import { Contrasena } from '../Interfaces/contrasena';

@Injectable({
  providedIn: 'any'
})
export class LoginServicesService {
  private localIP = '192.168.0.51';
  private externalIP = '181.129.199.174';
  private baseUrl: string = ''; // Se asignará dinámicamente

  // Objeto para almacenar las URLs
  private urls = {
    login: '',
    peticionCambio: '',
    obtenerUsuario: '',
    cambioContrasena: '',
    declineUpdatePassword: '',
    declineEmailConfirmation: ''
  };

  constructor(private http: HttpClient) {
    // La detección de red y la inicialización de URLs se harán antes de cada petición
  }

  // Inicializa las URLs basadas en la baseUrl determinada
  private initializeUrls(): void {
    this.urls.login = `${this.baseUrl}/iniciar_sesion`;
    this.urls.peticionCambio = `${this.baseUrl}/peticion_cambio_contrasena/`;
    // dataUpdateEstado usaba la misma URL que peticionCambio, así que no se necesita una entrada separada
    this.urls.obtenerUsuario = `${this.baseUrl}/obtener_usuario/`;
    this.urls.cambioContrasena = `${this.baseUrl}/cambio_contrasena/{correo}`; // Mantener el placeholder
    this.urls.declineUpdatePassword = `${this.baseUrl}/declineUpdate_password/`;
    this.urls.declineEmailConfirmation = `${this.baseUrl}/declineEmailConfirmation/`;
  }

  // Función para detectar si estamos en la red local
  private async detectNetwork(): Promise<void> {
    try {
      console.log('Intentando conectar a la red local (Login)...');
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);

      await fetch(`http://${this.localIP}:5000/api/health`, { // Puerto 5000 para login
        method: 'HEAD',
        // mode: 'no-cors', // Puede ser necesario
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      this.baseUrl = `http://${this.localIP}:5000/api/login`;
      console.log('Conectado exitosamente a la red local (Login)');
    } catch (error) {
      this.baseUrl = `http://${this.externalIP}:5000/api/login`;
      console.log('Fallo al conectar a la red local (Login), se usará IP externa');
    }
    // Actualizar URLs después de determinar baseUrl
    this.initializeUrls();
  }

  // Prepara la petición asegurando que la detección de red se complete primero
  private prepareRequest<T>(callback: () => Observable<T>): Observable<T> {
    return from(this.detectNetwork()).pipe(switchMap(() => callback()));
  }

  LoginValidation(userData: Login): Observable<any> {
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    return this.prepareRequest(() =>
      this.http.post(this.urls.login, userData, { headers }).pipe(catchError(this.handleError))
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage: MensajeError = { Message: 'An error occurred' };
    if (error.error instanceof ErrorEvent) {
      // Client-side errors
      errorMessage.Message = JSON.parse(error.error.message); // Asumiendo que el mensaje es un JSON string
    } else {
      // Server-side errors
      // Si el backend devuelve un objeto con la propiedad Message
      if (error.error && typeof error.error === 'object' && 'Message' in error.error) {
         return throwError(() => error.error); // Devuelve el objeto de error del backend
      }
      // Si no, crea un objeto MensajeError genérico
      errorMessage.Message = `Error del servidor: ${error.status}, ${error.statusText}`;
    }
    return throwError(() => errorMessage); // Devuelve un objeto MensajeError
  }

  //peticion para validar correo
  peticionCorreo(correo: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.prepareRequest(() =>
      this.http.post(this.urls.peticionCambio + correo, {}, { headers }) // Añadir cuerpo vacío si es POST
        .pipe(catchError(this.handleError))
    );
  }

  //validar estado del correo
  ValidarEstado(correo:string): Observable<any>{
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.prepareRequest(() =>
      this.http.get(this.urls.obtenerUsuario + correo, { headers })
        .pipe(catchError(this.handleError))
    );
  }

  CambiarContrasena(c:Contrasena, correo:string): Observable<any>{
    const headers = new HttpHeaders ({'Content-Type': 'application/json'});
    const url = this.urls.cambioContrasena.replace('{correo}', correo);
    return this.prepareRequest(() =>
      this.http.put(url, c, {headers})
        .pipe(catchError(this.handleError))
    );
  }

  //cancelar el proceso de cambio de contraseña
  declineUpdate(correo: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.prepareRequest(() =>
      this.http.put(this.urls.declineUpdatePassword + correo, {}, { headers }) // Añadir cuerpo vacío si es PUT
        .pipe(catchError(this.handleError))
    );
  }

  declineEmail_Confirmation(usuario: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.prepareRequest(() =>
      this.http.put(this.urls.declineEmailConfirmation + usuario, {}, { headers }) // Añadir cuerpo vacío si es PUT
        .pipe(catchError(this.handleError))
    );
  }
}

