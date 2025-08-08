import { Injectable, NgZone } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { GoogleAuthProvider } from '@firebase/auth';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, from } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

export interface ApiError {
  Message: string;
  StatusCode?: number;
}

@Injectable({
  providedIn: 'any'
})
export class AuthService {

  private localIP = '192.168.0.51';
  private externalIP = '181.129.199.174';
  private baseUrl: string = ''; // se asigna dinámicamente
  private apiUrl: string = '';

  userData: any;
  nombre: any;
  uid: any;
  fotoUser: any;
  correoUser: any;
  userVerified: string = '';

  constructor(
    private firebase: AngularFireAuth,
    private http: HttpClient,
    private router: Router,
    private ngZone: NgZone
  ) {
    this.firebase.authState.subscribe((user) => {
      if (user) {
        const parts = user.displayName?.split(' ');
        this.nombre = `${parts![0]} ${parts![1]}`;
        this.uid = user.uid;
        this.fotoUser = user.photoURL;
        this.correoUser = user.email;
        this.userVerified = user.emailVerified.toString();

        localStorage.setItem('nombre', this.nombre);
        localStorage.setItem('uid', this.uid);
        localStorage.setItem('photoURL', this.fotoUser);
        localStorage.setItem('email', this.correoUser);
        localStorage.setItem('userVerified', this.userVerified);
      } else {
        localStorage.setItem('user', 'null');
        localStorage.setItem('photoURL', 'null');
        localStorage.setItem('email', 'null');
        localStorage.setItem('userVerified', 'null');
      }
    });
  }

  private async detectNetwork(): Promise<void> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);

      await fetch(`http://${this.localIP}:5000/api/health`, {
        method: 'HEAD',
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      this.baseUrl = `http://${this.localIP}:5000/api/firebase`;
    } catch {
      this.baseUrl = `http://${this.externalIP}:5000/api/firebase`;
    }

    this.apiUrl = `${this.baseUrl}/ExistsUID/`;
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
    console.error('Error in auth service:', errorMessage);
    return throwError(() => ({ Message: errorMessage }));
  }

  isUserVerified(uid: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.prepareRequest(() =>
      this.http.post(this.apiUrl + uid, {}, { headers })
        .pipe(catchError(this.handleError))
    );
  }

  signUp(email: string, password: string) {
    return this.firebase.createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        this.userData = userCredential.user;
        this.observeUserState();
      })
      .catch((error) => {
        console.log(error.message);
      });
  }

  loginGoogle() {
    return this.firebase.signInWithPopup(new GoogleAuthProvider())
      .catch((error: Error) => {
        console.log("el error es:" + error.message);
      });
  }

  observeUserState() {
    this.firebase.authState.subscribe((userState) => {
      if (userState) {
        userState && this.ngZone.run(() => this.router.navigate(['menu/dashboard']));
      }
    });
  }

  get isLoggerIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user')!);
    return user !== null;
  }

  logOut() {
    return this.firebase.signOut().then(() => {
      localStorage.removeItem('name');
      localStorage.removeItem('photoURL');
      localStorage.removeItem('email');
      localStorage.removeItem('uid');
      localStorage.removeItem('userData');
      this.router.navigate(['/prueba-login']).then(() => window.location.reload());
    });
  }
}
