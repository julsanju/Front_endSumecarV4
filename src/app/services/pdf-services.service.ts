import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
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
  // Change to use local IP by default
  private baseUrl5000: string = `http://${this.localIP}:5000/api`;
  private baseUrl5107: string = `http://${this.localIP}:5107/api`;

  private apiUrl: string = '';
  private apiUrlPdf: string = '';
  private apiPdfHistorial: string = '';
  private apiPdfFile: string = '';

  constructor(private http: HttpClient) {
    // Initialize with default values (now using local IP)
    this.initializeUrls();

    // Detect network and update URLs if needed - only switch to external if local fails
    this.detectNetwork().then(isLocal => {
      if (!isLocal) {
        // Only change to external if local network is not available
        this.baseUrl5000 = `http://${this.externalIP}:5000/api`;
        this.baseUrl5107 = `http://${this.externalIP}:5107/api`;
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

  private initializeUrls(): void {
    this.apiUrl = `${this.baseUrl5000}/descargar_archivo`;
    this.apiUrlPdf = `${this.baseUrl5000}/factura/datos_pdf/`;
    this.apiPdfHistorial = `${this.baseUrl5107}/pdf/obtener_historialx/{username}/{rol}`;
    this.apiPdfFile = `${this.baseUrl5107}/pdf/pdfUrlx/{username}/{rol}`;
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

  generatePDF(data: PdfInterface): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(this.apiUrl, data, { headers })
      .pipe(catchError(this.handleError));
  }

  //metodo para mostrar datos del pdf
  mostrar_datosPdf(identificacion: string): Observable<PdfInterface[]> {
    return this.http.get<PdfInterface[]>(this.apiUrlPdf + identificacion)
      .pipe(catchError(this.handleError));
  }

  //metodo para mostrar el historial de documentos
  mostrar_historial(usuario: string, rol: number): Observable<DocumentosModel[]> {
    return this.http.get<DocumentosModel[]>(
      this.apiPdfHistorial.replace('{username}', usuario).replace('{rol}', rol.toString())
    ).pipe(catchError(this.handleError));
  }

  //metodo para obtener la URL del PDF
  obtenerPdfUrl(usuario: string, rol: number): Observable<any> {
    return this.http.get<any>(
      this.apiPdfFile.replace('{username}', usuario).replace('{rol}', rol.toString())
    ).pipe(catchError(this.handleError));
  }
}
