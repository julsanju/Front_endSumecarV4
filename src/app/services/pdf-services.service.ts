import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, from } from 'rxjs'; // Importar 'from'
import { catchError, switchMap } from 'rxjs/operators'; // Importar 'switchMap'
import { PdfInterface } from '../Interfaces/pdf-interface';
import { DocumentosModel } from '../Interfaces/documentos-model';

export interface ApiError {
  Message: string;
  StatusCode?: number;
}

@Injectable({
  providedIn: 'any'
})
export class PdfServicesService {
  private localIP = '192.168.0.51';
  private externalIP = '181.129.199.174';
  // Base URLs se asignarán dinámicamente
  private baseUrl5000: string = '';
  private baseUrl5107: string = '';

  // Objeto para almacenar las URLs
  private urls = {
    descargarArchivo: '',
    datosPdf: '',
    pdfHistorial: '',
    pdfFile: ''
  };

  constructor(private http: HttpClient) {
    // La detección de red y la inicialización de URLs se harán antes de cada petición
  }

  // Inicializa las URLs basadas en las baseUrls determinadas
  private initializeUrls(): void {
    this.urls.descargarArchivo = `${this.baseUrl5000}/descargar_archivo`;
    this.urls.datosPdf = `${this.baseUrl5000}/factura/datos_pdf/`;
    this.urls.pdfHistorial = `${this.baseUrl5107}/pdf/obtener_historialx/{username}/{rol}`; // Mantener placeholders
    this.urls.pdfFile = `${this.baseUrl5107}/pdf/pdfUrlx/{username}/{rol}`; // Mantener placeholders
  }

  // Función para detectar si estamos en la red local
  private async detectNetwork(): Promise<void> {
    let isLocal5000 = false;
    let isLocal5107 = false;

    // Check Port 5000
    try {
      console.log('Intentando conectar a la red local (PDF - Puerto 5000)...');
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
      console.log('Intentando conectar a la red local (PDF - Puerto 5107)...');
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
    console.error('Error in PDF service:', errorMessage);
    return throwError(() => ({ Message: errorMessage }));
  }

  // Improved network detection function - REMOVED (integrated into detectNetwork above)

  generatePDF(data: PdfInterface): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.prepareRequest(() =>
      this.http.post(this.urls.descargarArchivo, data, { headers })
        .pipe(catchError(this.handleError))
    );
  }

  //metodo para mostrar datos del pdf
  mostrar_datosPdf(identificacion: string): Observable<PdfInterface[]> {
    return this.prepareRequest(() =>
      this.http.get<PdfInterface[]>(this.urls.datosPdf + identificacion)
        .pipe(catchError(this.handleError))
    );
  }

  //metodo para mostrar el historial de documentos
  mostrar_historial(usuario: string, rol: number): Observable<DocumentosModel[]> {
    const url = this.urls.pdfHistorial.replace('{username}', usuario).replace('{rol}', rol.toString());
    return this.prepareRequest(() =>
      this.http.get<DocumentosModel[]>(url)
        .pipe(catchError(this.handleError))
    );
  }

  //metodo para obtener la URL del PDF
  obtenerPdfUrl(usuario: string, rol: number): Observable<any> {
    const url = this.urls.pdfFile.replace('{username}', usuario).replace('{rol}', rol.toString());
    return this.prepareRequest(() =>
      this.http.get<any>(url)
        .pipe(catchError(this.handleError))
    );
  }
}
