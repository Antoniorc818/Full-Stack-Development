import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class TripService {

  private apiUrl = 'http://localhost:3000/api/trips';

  constructor(
    private http: HttpClient,
    private authService: AuthenticationService
  ) {}

  private getAuthHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`
    });
  }

  getTrips(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  getTrip(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  addTrip(trip: any): Observable<any> {
    return this.http.post(this.apiUrl, trip, { headers: this.getAuthHeaders() });
  }

  updateTrip(id: string, trip: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, trip, { headers: this.getAuthHeaders() });
  }

  deleteTrip(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }
}