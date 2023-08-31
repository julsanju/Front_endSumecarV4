import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Login } from '../Interfaces/login';
@Injectable({
  providedIn: 'root'
})
export class LoginServicesService {
  private apiUrl = 'http://localhost:5171/api/login/iniciar_sesion';
  constructor(private http: HttpClient) { }

  LoginValidation(userData: Login): Observable<any> {
    const headers = new HttpHeaders({'Content-Type': 'application/json'});

    return this.http.post(this.apiUrl, userData, { headers });
  }
}
