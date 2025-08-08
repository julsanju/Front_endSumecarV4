import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, from } from 'rxjs'; // Importar 'from'
import { catchError, switchMap } from 'rxjs/operators'; // Importar 'switchMap'
import { Usuarios } from '../Interfaces/usuarios';
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
  private baseUrl: string = ''; // Se actualizará dinámicamente
  private urls = { // Objeto para almacenar las URLs
    registerUser: '',
    registerUserWithDataGoogle: '',
    agregarImagen: '',
    modificarEmpleado: ''
  };

  constructor(private http: HttpClient) {
    // La detección de red ahora se hace antes de cada petición
  }

  // Función para detectar si estamos en la red local
  private async detectNetwork(): Promise<void> {
    try {
      console.log('Intentando conectar a la red local (Register Service)...');
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);

      // Usamos el puerto 5000 según tu código original
      await fetch(`http://${this.localIP}:5000/api/health`, {
        method: 'HEAD',
        // mode: 'no-cors', // Descomentar si es necesario
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      this.baseUrl = `http://${this.localIP}:5000/api`; // Base URL local
      console.log('Conectado exitosamente a la red local (Register Service)');
    } catch (error) {
      this.baseUrl = `http://${this.externalIP}:5000/api`; // Base URL externa
      console.log('Fallo al conectar a la red local, se usará IP externa (Register Service)');
    }
    // Actualizar URLs después de determinar baseUrl
    this.initializeUrls();
  }

  // Inicializa las URLs basadas en la baseUrl determinada
  private initializeUrls(): void {
    this.urls.registerUser = `${this.baseUrl}/usuarios/insertar/`;
    this.urls.registerUserWithDataGoogle = `${this.baseUrl}/usuarios/insertarDataGoogle/`;
    this.urls.agregarImagen = `${this.baseUrl}/guardar_imagen`;
    this.urls.modificarEmpleado = `${this.baseUrl}/usuarios/modificar_empleado`;
  }

  // Prepara la petición asegurando que la detección de red se complete primero
  private prepareRequest<T>(callback: () => Observable<T>): Observable<T> {
    return from(this.detectNetwork()).pipe(switchMap(() => callback()));
  }

  // Método de ayuda para el manejo de errores
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Ocurrió un error desconocido';
    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Error del lado del servidor
      errorMessage = `Código de Error: ${error.status}\nMensaje: ${error.message}`;
    }
    console.error('Error en el servicio de registro:', errorMessage);
    return throwError(() => ({ Message: errorMessage }));
  }

  // registerUser(userData: FormData, username: string): Observable<any> {
  //   // Envuelve la llamada HTTP con prepareRequest
  //   return this.prepareRequest(() =>
  //     this.http.post(this.urls.registerUser + username, userData)
  //       .pipe(catchError(this.handleError))
  //   );
  // }

  registerxd(userData: Usuariosxd, username: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    // Envuelve la llamada HTTP con prepareRequest
    return this.prepareRequest(() =>
      this.http.post(this.urls.registerUser + username, userData, { headers }) // Reutiliza la URL de registerUser si es la misma
        .pipe(catchError(this.handleError))
    );
  }

  registerUserWithDataGoogle(userData: FormData, uid: string): Observable<any> {
     // Envuelve la llamada HTTP con prepareRequest
    return this.prepareRequest(() =>
      this.http.post(this.urls.registerUserWithDataGoogle + uid, userData)
        .pipe(catchError(this.handleError))
    );
  }

  agregarImagen(imagen: FormData, httpOptions: { headers: HttpHeaders }): Observable<any> {
     // Envuelve la llamada HTTP con prepareRequest
    return this.prepareRequest(() =>
      this.http.post<any>(this.urls.agregarImagen, imagen, httpOptions)
        .pipe(catchError(this.handleError))
    );
  }

  ModificarEmpleado(empleados: Empleado): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
     // Envuelve la llamada HTTP con prepareRequest
    return this.prepareRequest(() =>
      this.http.put(this.urls.modificarEmpleado, empleados, { headers })
        .pipe(catchError(this.handleError))
    );
  }
}

