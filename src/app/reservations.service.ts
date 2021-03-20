import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Reservation } from './reservations';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
@Injectable({
  providedIn: 'root'
})
export class ReservationsService {
  readonly GET_RESERVATIONS = 'http://localhost:8080/api/reservations/';

  constructor(private http: HttpClient) { }

  getReservations(): Observable<Reservation[]>{
    return this.http.get<Reservation[]>(this.GET_RESERVATIONS, httpOptions);
  }
}
