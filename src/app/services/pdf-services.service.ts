import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PdfInterface } from '../Interfaces/pdf-interface';

@Injectable({
  providedIn: 'any'
})
export class PdfServicesService {

  private apiUrl = 'https://microservicio-sumecar-ventas.azurewebsites.net/api/descargar_archivo';
  private apiUrlPdf = 'https://sumecarventas.azurewebsites.net/api/factura/datos_pdf/'
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
}
