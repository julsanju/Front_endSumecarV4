import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, from } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
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
  private baseUrl: string = '';

  constructor(private http: HttpClient) {
    // No se asigna baseUrl aquí, se hace dinámicamente en cada petición
  }

  // ✅ Versión mejorada del detector de red
  private async detectNetwork(): Promise<void> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);

      await fetch(`http://${this.localIP}:5107/api/health`, {
        method: 'HEAD',
        mode: 'no-cors', // ← importante para evitar bloqueo por CORS
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      console.log('✅ Red local detectada');
      this.baseUrl = `http://localhost:5107/api/Dashboard`;
    } catch (error) {
      console.log('⚠️ No se pudo acceder a la red local, usando IP pública');
      this.baseUrl = `http://${this.externalIP}:5107/api/Dashboard`;
    }
  }

  // Encapsula la lógica de detección antes de realizar la petición
  private prepareRequest<T>(callback: () => Observable<T>): Observable<T> {
    return from(this.detectNetwork()).pipe(switchMap(() => callback()));
  }

  // Manejo de errores
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error('Error in dashboard service:', errorMessage);
    return throwError(() => ({ Message: errorMessage }));
  }

  // Obtener pedidos y gráficos
  obtenerDatos(username: string, rol: string, movimiento: string): Observable<Dashboard[]> {
    return this.prepareRequest(() => {
      const url = `${this.baseUrl}/mostrar_graficoGeneral/${username}/${rol}/${movimiento}`;
      return this.http.get<Dashboard[]>(url).pipe(catchError(this.handleError));
    });
  }

  // Obtener pedidos confirmados
  obtenerConfirmados(): Observable<Dashboard[]> {
    return this.prepareRequest(() => {
      const url = `${this.baseUrl}/Pedidos_montados`;
      return this.http.get<Dashboard[]>(url).pipe(catchError(this.handleError));
    });
  }

  // Obtener pedidos pendientes
  obtenerPendientes(usuario: string, opcion: string): Observable<Dashboard[]> {
    return this.prepareRequest(() => {
      const url = `${this.baseUrl}/Pedidos_pendientes/${usuario}/${opcion}`;
      return this.http.get<Dashboard[]>(url).pipe(catchError(this.handleError));
    });
  }

  // Obtener pedidos finalizados
  obtenerFinalizados(): Observable<Dashboard[]> {
    return this.prepareRequest(() => {
      const url = `${this.baseUrl}/Pedidos_finalizados`;
      return this.http.get<Dashboard[]>(url).pipe(catchError(this.handleError));
    });
  }
}
