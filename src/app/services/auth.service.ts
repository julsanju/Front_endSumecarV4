import { Injectable, NgZone } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { GoogleAuthProvider } from '@firebase/auth';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

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
  private baseUrl: string = `http://${this.localIP}:5000/api/firebase`;
  private apiUrl: string = '';

  userData:any;
  nombre: any;
  uid:any;
  fotoUser: any;
  correoUser: any;
  userVerified: string = '';

  constructor(private firebase: AngularFireAuth,
    private http:HttpClient,
    private router: Router,
    private ngZone: NgZone) 
    { 
      // Initialize with default values (local IP)
      this.initializeUrls();
      
      // Detect network and update URLs if needed
      this.detectNetwork().then(isLocal => {
        if (!isLocal) {
          // Only change to external if local network is not available
          this.baseUrl = `http://${this.externalIP}:5000/api/firebase`;
          this.initializeUrls();
          console.log('Local network not available, using external IP configuration');
        } else {
          console.log('Using local network configuration');
        }
      }).catch((error) => {
        // If detection fails, stay with local IP as default
        console.log('Network detection failed, staying with local IP', error);
      });

      this.firebase.authState.subscribe((user) =>{
        if (user) {
          
          const parts = user.displayName?.split(' ');


          this.nombre = `${parts![0]} ${parts![1]}`;

          this.uid = user.uid;
          this.fotoUser = user.photoURL;
          this.correoUser = user.email;
          this.userVerified = user.emailVerified.toString();
          
          localStorage.setItem('nombre', this.nombre)
          localStorage.setItem('uid', this.uid)
          localStorage.setItem('photoURL', this.fotoUser);
          localStorage.setItem('email', this.correoUser);
          localStorage.setItem('userVerified', this.userVerified);
          
        } else{
          localStorage.setItem('user', 'null');
          localStorage.setItem('photoURL', 'null');
          localStorage.setItem('email', 'null');
          localStorage.setItem('userVerified', 'null');
        }
      })
    }

    // Initialize URLs based on the determined base URL
    private initializeUrls(): void {
      this.apiUrl = `${this.baseUrl}/ExistsUID/`;
    }

    // Function to detect if we're on the local network
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
      console.error('Error in auth service:', errorMessage);
      return throwError(() => ({ Message: errorMessage }));
    }

    //metodo para validar si el usuario esta ya registrado con su autenticacion o no
    isUserVerified(uid:string):Observable<any>{
      const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      return this.http.post(this.apiUrl + uid, {}, { headers })
        .pipe(catchError(this.handleError));
    }

    signUp(email:string, password:string){
      return this.firebase.createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        this.userData = userCredential.user
        this.observeUserState()
      })
      .catch((error) => {
        console.log(error.message);
      })
    }

    // logueo con google 
    loginGoogle(){
      return this.firebase.signInWithPopup(new GoogleAuthProvider())
      // .then(() => 
      //  this.observeUserState()
      // )
      .catch((error:Error) =>{
        console.log("el error es:" + error.message);
      })
    }

    // revisar el estado de la autenticacion
    observeUserState(){
      
      this.firebase.authState.subscribe((userState) =>{
        if (userState) {
          userState && this.ngZone.run(() => this.router.navigate(['menu/dashboard']))
        }
      })
    }

    //poner true si esta logueado o false si no lo esta
    get isLoggerIn() :boolean{
      const user = JSON.parse(localStorage.getItem('user')!);
      return user !== null
    }

    logOut(){
      return this.firebase.signOut().then(() => {
        localStorage.removeItem('name');
        localStorage.removeItem('photoURL');
        localStorage.removeItem('email');
        localStorage.removeItem('uid');
        localStorage.removeItem('userData')
        this.router.navigate(['/prueba-login']).then(() => window.location.reload());
      })
    }
}
