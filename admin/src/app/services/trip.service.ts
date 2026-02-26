import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TripService {

  private apiUrl = 'http://localhost:3000/api/trips';

  constructor(private http: HttpClient) {}

  getTrips(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  getTrip(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  addTrip(trip: any): Observable<any> {
    return this.http.post(this.apiUrl, trip);
  }

  updateTrip(id: string, trip: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, trip);
  }

  deleteTrip(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
