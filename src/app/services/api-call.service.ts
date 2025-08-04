import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, from, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiCallService {

  constructor(private http: HttpClient) { }
  private baseroute = 'https://localhost:7000/api/'; 
  
  getHeader() {
    return new HttpHeaders({
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    });
  }
      
  gettokenHeader() {
    debugger
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
    if (error.status === 400) {
        // If status is 400, user already exists
        return throwError(() => new Error('User already exists'));
    }
    // Handle other errors
    return throwError(() => new Error('An error occurred'));
}
}
