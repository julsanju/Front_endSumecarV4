import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, from } from 'rxjs'; // Importar 'from'
import { catchError, switchMap } from 'rxjs/operators'; // Importar 'switchMap'
import { Peticiones } from '../Interfaces/peticiones';
import { Empleado } from '../Interfaces/empleado';

export interface ApiError {
  Message: string;
  StatusCode?: number;
}

@Injectable({
  providedIn: 'any'
})
export class PeticioneServicesService {

  private localIP = '192.168.0.51';
  private externalIP = '181.129.199.174';
  // Base URLs se asignarán dinámicamente
  private baseUrl5107: string = '';
  private baseUrl5000: string = ''; // Renombrado desde baseUrl443 para claridad

  // Objeto para almacenar las URLs
  private urls = {
    mostrarPeticiones: '',
    finalizarPeticion: '',
    obtenerCorreoEmpleado: '', // Renombrado desde ApiurlObtenerCorreo
    eliminarPeticion: ''
  };

  constructor(private http: HttpClient) {
    // La detección de red y la inicialización de URLs se harán antes de cada petición
  }

  // Inicializa las URLs basadas en las baseUrls determinadas
  private initializeUrls(): void {
    this.urls.mostrarPeticiones = `${this.baseUrl5107}/mostrar_peticiones/{estado}/{username}/{rol}`; // Mantener placeholders
    this.urls.finalizarPeticion = `${this.baseUrl5107}/finalizar_peticion/`;
    this.urls.obtenerCorreoEmpleado = `${this.baseUrl5000}/usuarios/obtener_empleado/`; // Usar baseUrl5000
    this.urls.eliminarPeticion = `${this.baseUrl5107}/peticion/eliminar/`;
  }

  // Función para detectar si estamos en la red local
  private async detectNetwork(): Promise<void> {
     let isLocal5000 = false;
     let isLocal5107 = false;

     // Check Port 5000 (anteriormente 443 en el código original, pero el endpoint usa 5000)
     try {
       console.log('Intentando conectar a la red local (Peticiones - Puerto 5000)...');
       const controller = new AbortController();
       const timeoutId = setTimeout(() => controller.abort(), 2000);
       await fetch(`http://${this.localIP}:5000/api/health`, { method: 'HEAD', signal: controller.signal });
       clearTimeout(timeoutId);
       this.baseUrl5000 = `http://${this.localIP}:5000/api`;
       isLocal5000 = true;
       console.log('Conectado exitosamente a la red local (Puerto 5000)');
     } catch (error) {
       this.baseUrl5000 = `http://${this.externalIP}:5000/api`;
       console.log('Fallo al conectar a la red local (Puerto 5000), se usará IP externa');
     }

     // Check Port 5107
     try {
       console.log('Intentando conectar a la red local (Peticiones - Puerto 5107)...');
       const controller = new AbortController();
       const timeoutId = setTimeout(() => controller.abort(), 2000);
       await fetch(`http://${this.localIP}:5107/api/health`, { method: 'HEAD', mode: 'no-cors', signal: controller.signal });
       clearTimeout(timeoutId);
       this.baseUrl5107 = `http://${this.localIP}:5107/api`;
       isLocal5107 = true;
       console.log('Conectado exitosamente a la red local (Puerto 5107)');
     } catch (error) {
       this.baseUrl5107 = `http://${this.externalIP}:5107/api`;
       console.log('Fallo al conectar a la red local (Puerto 5107), se usará IP externa');
     }

     // Actualizar URLs después de determinar baseUrls
     this.initializeUrls();
  }

   // Prepara la petición asegurando que la detección de red se complete primero
   private prepareRequest<T>(callback: () => Observable<T>): Observable<T> {
     return from(this.detectNetwork()).pipe(switchMap(() => callback()));
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
    console.error('Error in peticiones service:', errorMessage); // Mensaje de error específico del servicio
    return throwError(() => ({ Message: errorMessage }));
  }

  // Function to detect if we're on the local network - REMOVED (integrated into detectNetwork above)

  ObtenerPeticiones(estado: string, username: string, rol: string): Observable<Peticiones[]> {
    const url = this.urls.mostrarPeticiones.replace('{estado}', estado).replace('{username}', username).replace('{rol}', rol);
    return this.prepareRequest(() =>
      this.http.get<Peticiones[]>(url)
        .pipe(catchError(this.handleError))
    );
  }

  FinalizarPeticion(id: number): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.prepareRequest(() =>
      this.http.put(this.urls.finalizarPeticion + id, {}, { headers })
        .pipe(catchError(this.handleError))
    );
  }

  obtenerCorreo(username: string): Observable<Empleado[]> {
    return this.prepareRequest(() =>
      this.http.get<Empleado[]>(this.urls.obtenerCorreoEmpleado + username)
        .pipe(catchError(this.handleError))
    );
  }

  EliminarPeticion(numero_peticion: number): Observable<any> {
    return this.prepareRequest(() =>
      this.http.delete(this.urls.eliminarPeticion + numero_peticion)
        .pipe(catchError(this.handleError))
    );
  }
}
