import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuarios } from '../Interfaces/usuarios'; // Asegúrate de importar correctamente la interfaz
import { Empleado } from '../Interfaces/empleado';

@Injectable({
  providedIn: 'any'
})
export class RegisterService {
  
  private apiUrl = 'https://sumecarventas.azurewebsites.net/api/usuarios/insertar/';
  private apiUrlDataGoogle = 'https://sumecarventas.azurewebsites.net/api/usuarios/insertarDataGoogle/' 
  private imagenUrl = 'https://microservicio-sumecar-ventas.azurewebsites.net/api/guardar_imagen';
  private ApiUrlModificarEmpleado = 'https://sumecarventas.azurewebsites.net/api/usuarios/modificar_empleado'
  
  

  constructor(private http: HttpClient) { }

  registerUser(userData: FormData, username:string): Observable<any> {
    return this.http.post(this.apiUrl + username, userData);
  }

  registerUserWithDataGoogle(userData: FormData, uid:string): Observable<any> {
    return this.http.post(this.apiUrlDataGoogle + uid, userData);
  }

  agregarImagen(imagen: FormData, httpOptions: { headers: HttpHeaders }): Observable<any> {
    
    return this.http.post<any>(this.imagenUrl, imagen, httpOptions);
}

ModificarEmpleado(empleados : Empleado): Observable<any>{
  const headers = new HttpHeaders ({'Content-Type': 'application/json'})
  return this.http.put(this.ApiUrlModificarEmpleado, empleados, {headers});
}
  
}

