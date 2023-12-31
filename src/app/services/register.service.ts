import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuarios } from '../Interfaces/usuarios'; // Asegúrate de importar correctamente la interfaz

@Injectable({
  providedIn: 'any'
})
export class RegisterService {
  private apiUrl = 'https://sumecar-ventas.azurewebsites.net/api/usuarios/insertar'; // Reemplaza con la URL correcta
  private imagenUrl = 'https://microservicio-sumecar-ventas.azurewebsites.net/api/guardar_imagen';

  //headers
  

  constructor(private http: HttpClient) { }

  registerUser(userData: Usuarios): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post(this.apiUrl, userData, { headers });
  }

  /*agregarImagen(image : File){
    const formData = new FormData();
    formData.append('imagen', image);

    return this.http.post(this.imagenUrl, formData);
  }*/

  agregarImagen(imagen: FormData, httpOptions: { headers: HttpHeaders }): Observable<any> {
    
    return this.http.post<any>(this.imagenUrl, imagen, httpOptions);
}
  
}

