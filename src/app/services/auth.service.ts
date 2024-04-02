import { Injectable, NgZone } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { GoogleAuthProvider } from '@firebase/auth';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'any'
})
export class AuthService {

  //private apiUrl = 'https://sumecarventas.azurewebsites.net/api/firebase/ExistsUID/'
  private apiUrl = 'http://localhost:5171/api/firebase/ExistsUID/'

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

    //metodo para validar si el usuario esta ya registrado con su autenticacion o no
    isUserVerified(uid:string):Observable<any>{
      const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      return this.http.post(this.apiUrl + uid, {headers});
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
        console.log("te has deslogueado")
        console.log(localStorage.getItem('uid'))
        this.router.navigate(['/prueba-login']).then(() => window.location.reload());
      })
    }
}
