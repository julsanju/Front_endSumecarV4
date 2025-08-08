import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, from } from 'rxjs'; // Import 'from'
import { catchError, switchMap } from 'rxjs/operators'; // Import 'switchMap'
import { Login } from '../Interfaces/login';
import { MensajeError } from '../Interfaces/mensaje-error';

@Injectable({
  providedIn: 'any'
})
export class ValidationService {

  private localIP = '192.168.0.51';
  private externalIP = '181.129.199.174';
  private baseUrl: string = ''; // Will be updated dynamically
  private urls = { // Object to store URLs
    validateCaptcha: ''
    // Add other specific endpoints for this service here
  };

  constructor(private http: HttpClient) {
    // Network detection is now done before each request
  }

  // Function to detect if we are on the local network
  private async detectNetwork(): Promise<void> {
    try {
      console.log('Attempting to connect to local network (Validation Service)...');
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);

      // *** IMPORTANT: Replace XXXX with the correct port for the Validation API health check ***
      await fetch(`http://${this.localIP}:XXXX/api/health`, {
        method: 'HEAD',
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      // *** IMPORTANT: Replace XXXX with the correct port for the Validation API ***
      this.baseUrl = `http://${this.localIP}:XXXX/api/validation`; // Adjust base path if needed
      console.log('Successfully connected to local network (Validation Service)');
    } catch (error) {
      // *** IMPORTANT: Replace XXXX with the correct port for the Validation API ***
      this.baseUrl = `http://${this.externalIP}:XXXX/api/validation`; // Adjust base path if needed
      console.log('Failed to connect to local network, using external IP (Validation Service)');
    }
    // Update URLs after determining baseUrl
    this.initializeUrls();
  }

  // Initialize URLs based on the determined baseUrl
  private initializeUrls(): void {
    this.urls.validateCaptcha = `${this.baseUrl}/captcha`; // Example endpoint, adjust as needed
    // Define other URLs based on the baseUrl
  }

  // Prepare the request ensuring network detection completes first
  private prepareRequest<T>(callback: () => Observable<T>): Observable<T> {
    return from(this.detectNetwork()).pipe(switchMap(() => callback()));
  }

  // Helper method for error handling
  private handleError(error: HttpErrorResponse) {
    let errorMessage: MensajeError = { Message: 'An error occurred' };
    if (error.error instanceof ErrorEvent) {
      // Client-side errors
      errorMessage.Message = JSON.parse(error.error.message);
    } else {
      // Server-side errors
      return throwError(error.error); // Devuelve solo el JSON de la respuesta del backend
    }
    return throwError(errorMessage);
    console.error('Error in validation service:', errorMessage);
  }

  validateCaptcha(token: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    // Wrap the HTTP call with prepareRequest
    return this.prepareRequest(() =>
      this.http.post(this.urls.validateCaptcha, { token }, { headers }) // Assuming body { "token": "..." }
        .pipe(catchError(this.handleError))
    );
  }
}
