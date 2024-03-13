import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { environment } from './environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideClientHydration(),
    importProvidersFrom(provideFirebaseApp(() => 
    initializeApp(environment.firebase))), 
    importProvidersFrom(provideAuth(() => getAuth())), importProvidersFrom(provideFirebaseApp(() => initializeApp({ "projectId": "pharmapa-e493a", "appId": "1:84829409591:web:f57585aa5ff2efb6c20ab2", "storageBucket": "pharmapa-e493a.appspot.com", "apiKey": "AIzaSyAk_XIuhbohApVwZV6UPMl1O1qXdWRxfiA", "authDomain": "pharmapa-e493a.firebaseapp.com", "messagingSenderId": "84829409591", "measurementId": "G-0KFN5DKBHR" }))), importProvidersFrom(provideAuth(() => getAuth())), importProvidersFrom(provideFirebaseApp(() => initializeApp({"projectId":"loginprueba-795a1","appId":"1:588487966441:web:85600c6de88aad0b0c7a78","storageBucket":"loginprueba-795a1.appspot.com","apiKey":"AIzaSyACO5PCi9KXIJiztXO3zomnMUxFtCcW9JU","authDomain":"loginprueba-795a1.firebaseapp.com","messagingSenderId":"588487966441"}))), importProvidersFrom(provideAuth(() => getAuth()))]
};
