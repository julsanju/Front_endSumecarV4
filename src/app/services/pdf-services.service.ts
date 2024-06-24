import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PdfInterface } from '../Interfaces/pdf-interface';
import { DocumentosModel } from '../Interfaces/documentos-model';

@Injectable({
  providedIn: 'any'
})
export class PdfServicesService {

  private apiUrl = 'https://microservicio-sumecar-ventas.azurewebsites.net/api/descargar_archivo';
  private apiUrlPdf = 'https://sumecarventas.azurewebsites.net/api/factura/datos_pdf/';
  private apiPdfHistorial = 'http://localhost:5107/api/pdf/obtener_historial/{username}/{rol}';
  constructor(private http: HttpClient) { }

  generatePDF(data: PdfInterface): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  return this.http.post(this.apiUrl, data, { headers });
    //return this.http.post(this.apiUrl, data, { responseType: 'blob' });
  }

  //metodo para mostrar datos del pdf
  mostrar_datosPdf(identificacion:string): Observable<PdfInterface[]>{
    return this.http.get<PdfInterface[]>(this.apiUrlPdf + identificacion);
  }

  //metodo para mostrar el historial de documentos
  mostrar_historial(usuario:string, rol:number): Observable<DocumentosModel[]>{
    return this.http.get<DocumentosModel[]>(this.apiPdfHistorial.replace('{username}', usuario).replace('{rol}', rol.toString()))
  }
}
