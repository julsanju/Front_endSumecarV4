import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';

declare var grecaptcha: any;

@Injectable({
  providedIn: 'any'
})
export class CaptchaServicesService {
  private apiUrl = 'http://localhost:5171/api/login/validationCaptcha';

  constructor(private http: HttpClient) { }

  verify(): Observable<any> {
    return new Observable(observer => {
      grecaptcha.ready(() => {
        grecaptcha.execute('6Ler35wpAAAAABH5SgwP37UGKErdadY5ufJCaQzl', { action: 'submit' }).then((token: string) => {

          this.http.post(this.apiUrl, { token }).subscribe(response => {

            const success = response ? true : false;
            observer.next({ success });
            observer.complete();
          },
            error => {
              console.error('Error al validar reCAPTCHA:', error);
              observer.next({ success: false });
              observer.complete();
            });

        });
      });
    });
  }

  getTokenClientModule(token: string): Observable<any> {
    
      return this.http.post<any>( this.apiUrl , token )
        .pipe(
          map((response) => response),
          catchError((err) => {
            console.log('error caught in service')
            console.error(err);
            return throwError(err);
          })
        );
  }
}
