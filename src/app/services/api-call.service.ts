import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Observable, catchError, from, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiCallService {

  constructor(private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }
  private baseroute = 'https://localhost:7000/api/';

  getHeader() {
    return new HttpHeaders({
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    });
  }

  gettokenHeader() {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('token');
      if (!token) {
        return new HttpHeaders({
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        });// If no token, return headers without Authorization
      }
      return new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      });
    } else {
      return new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }); // If not browser, return headers without Authorization
    }
  }
  PostcallWithoutToken(url: string, data: any): Observable<any> {
    const headers = this.getHeader();
    const finalroute = this.baseroute + url;
    var response = this.http.post<any>(finalroute, data, { headers }).pipe
      (catchError(this.handleError));
    return response;
  }
  PostcallWithToken(url: string, data: any): Observable<any> {
    const headers = this.gettokenHeader();
    const finalroute = this.baseroute + url;
    var response = this.http.post<any>(finalroute, data, { headers }).pipe
      (catchError(this.handleError));
    return response;
  }
  GetcallWithToken(url: string): Observable<any> {
    const headers = this.gettokenHeader();
    const finalroute = this.baseroute + url;
    var response = this.http.get<any>(finalroute, { headers }).pipe
      (catchError(this.handleError));
    return response;
  }
  GetcallWithoutToken(url: string): Observable<any> {
    const headers = this.getHeader();
    const finalroute = this.baseroute + url;
    var response = this.http.get<any>(finalroute, { headers }).pipe
      (catchError(this.handleError));
    return response;
  }


  private handleError(error: HttpErrorResponse): Observable<never> {
    // console.error('API error:', error); // Add this line for debugging
    if (error.status === 400) {
      return throwError(() => new Error('User already exists'));
    }
    return throwError(() => new Error(error.message || 'An error occurred'));
  }
  PostFormDataWithToken(url: string, formData: FormData): Observable<any> {
    const headers = this.gettokenHeader().delete('Content-Type'); // Let browser set Content-Type
    const finalroute = this.baseroute + url;
    return this.http.post<any>(finalroute, formData, { headers }).pipe(
      catchError(this.handleError)
    );
  }
}
