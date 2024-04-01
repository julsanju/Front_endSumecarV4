import { Injectable, NgZone } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { GoogleAuthProvider } from '@firebase/auth';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'any'
})
export class AuthService {

  userData: any;
  fotoUser: any;
  correoUser: any;
  userVerified: string = '';

  constructor(private firebase: AngularFireAuth,
    private router: Router,
    private ngZone: NgZone) 
    { 
      this.firebase.authState.subscribe((user) =>{
        if (user) {
          
          const parts = user.displayName?.split(' ');


          this.userData = `${parts![0]} ${parts![1]}`;

          //this.userData = user.displayName
          this.fotoUser = user.photoURL;
          this.correoUser = user.email;
          this.userVerified = user.emailVerified.toString();
          
          localStorage.setItem('user', this.userData)
          localStorage.setItem('photoURL', this.fotoUser);
          localStorage.setItem('email', this.correoUser);
          localStorage.setItem('userVerified', this.userVerified);
          console.log(this.userVerified)
        } else{
          localStorage.setItem('user', 'null');
          localStorage.setItem('photoURL', 'null');
          localStorage.setItem('email', 'null');
          localStorage.setItem('userVerified', 'null');
        }
      })
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
      .then(() => 
       this.observeUserState()
      )
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
        localStorage.removeItem('user');
        localStorage.removeItem('photoURL');
        localStorage.removeItem('email');
        localStorage.removeItem('userData')
        console.log("te has deslogueado")
        console.log(localStorage.getItem('userData'))
        this.router.navigate(['/prueba-login']);
      })
    }
}
