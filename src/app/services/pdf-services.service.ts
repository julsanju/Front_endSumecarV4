import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PdfInterface } from '../Interfaces/pdf-interface';

@Injectable({
  providedIn: 'root'
})
export class PdfServicesService {

  private apiUrl = 'http://localhost:5107/api/descargar_archivo';

  constructor(private http: HttpClient) { }

  generatePDF(data: PdfInterface): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  return this.http.post(this.apiUrl, data, { headers });
    //return this.http.post(this.apiUrl, data, { responseType: 'blob' });
  }
}
