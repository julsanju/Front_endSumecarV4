import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, from } from 'rxjs'; // Import 'from'
import { catchError, switchMap } from 'rxjs/operators'; // Import 'switchMap'
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
  private baseUrl: string = ''; // Se actualizará dinámicamente
  private urls = { // Objeto para almacenar las URLs
    addPeticion: ''
  };

  constructor(private http: HttpClient) {
    // La detección de red ahora se hace antes de cada petición
  }

  // Función para detectar si estamos en la red local
  private async detectNetwork(): Promise<void> {
    try {
      console.log('Intentando conectar a la red local...');
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);

      // Ajusta el puerto si es necesario para el servicio de correos
      await fetch(`http://${this.localIP}:5107/api/health`, {
        method: 'HEAD',
        // mode: 'no-cors', // Puede ser necesario dependiendo de la configuración del servidor
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      this.baseUrl = `http://${this.localIP}:5107/api`;
      console.log('Conectado exitosamente a la red local');
    } catch (error) {
      this.baseUrl = `http://${this.externalIP}:5107/api`;
      console.log('Fallo al conectar a la red local, se usará IP externa');
    }
    // Actualizar URLs después de determinar baseUrl
    this.initializeUrls();
  }

  // Inicializa las URLs basadas en la baseUrl determinada
  private initializeUrls(): void {
    this.urls.addPeticion = `${this.baseUrl}/agregar_peticion/`;
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
    console.error('Error en el servicio de envío de correos:', errorMessage);
    return throwError(() => ({ Message: errorMessage }));
  }

  addPeticion(data: DetallePeticionModel[], usuario: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    // Envuelve la llamada HTTP con prepareRequest
    return this.prepareRequest(() =>
      this.http.post(this.urls.addPeticion + usuario, data, { headers })
        .pipe(catchError(this.handleError))
    );
  }
}
