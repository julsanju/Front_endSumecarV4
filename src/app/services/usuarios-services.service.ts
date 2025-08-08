import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, from } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { UsuariosView } from '../Interfaces/usuarios-view';
import { Empleado } from '../Interfaces/empleado';
import { Imagen } from '../Interfaces/imagen';
import { DepartamentoCiudad } from '../Interfaces/departamento-ciudad';

export interface ApiError {
  Message: string;
  StatusCode?: number;
}

@Injectable({
  providedIn: 'any'
})
export class UsuariosServicesService {

  private localIP = '192.168.0.51';
  private externalIP = '181.129.199.174';
  private baseUrl = ''; // baseUrl se actualizará dinámicamente

  private urls = {
    obtenerUsuarios: '',
    obtenerEmpleado: '',
    imagenUser: '',
    filtroEmpleado: '',
    departamentos: '',
    ciudades: '',
    mapeo: '',
    existsCustomer: '',
  };

  constructor(private http: HttpClient) {}

  private async detectNetwork(): Promise<void> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);

      await fetch(`http://${this.localIP}:5000/api/health`, {
        method: 'HEAD',
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      this.baseUrl = `http://${this.localIP}:5000/api/usuarios`;
    } catch {
      this.baseUrl = `http://${this.externalIP}:5000/api/usuarios`;
    }

    // Actualizar URLs
    this.urls = {
      obtenerUsuarios: `${this.baseUrl}/obtener`,
      obtenerEmpleado: `${this.baseUrl}/obtener_todosUsuarios`,
      imagenUser: `${this.baseUrl}/imagen/`,
      filtroEmpleado: `${this.baseUrl}/obtener_empleado_admin`,
      departamentos: `${this.baseUrl}/obtener_departamentos`,
      ciudades: `${this.baseUrl}/obtener_departamentos/`,
      mapeo: `${this.baseUrl}/obtener_empleado/`,
      existsCustomer: `${this.baseUrl}/existenciaCliente/`,
    };
  }

  private prepareRequest<T>(callback: () => Observable<T>): Observable<T> {
    return from(this.detectNetwork()).pipe(switchMap(() => callback()));
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error('Error in usuarios service:', errorMessage);
    return throwError(() => ({ Message: errorMessage }));
  }

  isCustomerExists(identificacion: string): Observable<any> {
    return this.prepareRequest(() =>
      this.http.post(this.urls.existsCustomer + identificacion, {}, {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      }).pipe(catchError(this.handleError))
    );
  }

  obtenerUsuarios(): Observable<UsuariosView[]> {
    return this.prepareRequest(() =>
      this.http.get<UsuariosView[]>(this.urls.obtenerUsuarios)
        .pipe(catchError(this.handleError))
    );
  }

  obtenerEmpleado(): Observable<Empleado[]> {
    return this.prepareRequest(() =>
      this.http.get<Empleado[]>(this.urls.obtenerEmpleado)
        .pipe(catchError(this.handleError))
    );
  }

  filtroEmpleado_admin(): Observable<Empleado[]> {
    return this.prepareRequest(() =>
      this.http.get<Empleado[]>(this.urls.filtroEmpleado)
        .pipe(catchError(this.handleError))
    );
  }

  obtenerImagenUser(username: string): Observable<string> {
    return this.prepareRequest(() =>
      this.http.get(this.urls.imagenUser + username, { responseType: 'text' })
        .pipe(catchError(this.handleError))
    );
  }

  obtenerDepartamento(): Observable<DepartamentoCiudad[]> {
    return this.prepareRequest(() =>
      this.http.get<DepartamentoCiudad[]>(this.urls.departamentos)
        .pipe(catchError(this.handleError))
    );
  }

  obtenerCiudad(codigo: string): Observable<DepartamentoCiudad[]> {
    return this.prepareRequest(() =>
      this.http.get<DepartamentoCiudad[]>(this.urls.ciudades + codigo)
        .pipe(catchError(this.handleError))
    );
  }

  obtenerMapeo(username: string): Observable<UsuariosView[]> {
    return this.prepareRequest(() =>
      this.http.get<UsuariosView[]>(this.urls.mapeo + username)
        .pipe(catchError(this.handleError))
    );
  }
}
