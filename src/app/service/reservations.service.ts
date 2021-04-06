import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Reservation } from '../model/ReservationRequest';
import { Message } from '../model/Message';


@Injectable({
  providedIn: 'root'
})
export class ReservationsService {
  readonly GET_RESERVATIONS = 'http://localhost:8080/api/reservations/list';

  constructor(private http: HttpClient) { }

  getReservations(): Observable<Reservation[]>{
    let enco: any = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')

    return this.http.get<Reservation[]>(this.GET_RESERVATIONS, {headers: enco, withCredentials: true});
  }

  private handleError<T>(operation = 'operation') {
    return (error: any): Observable<Message> => {
      return of(new Message(error.message));
    };
  }
}
