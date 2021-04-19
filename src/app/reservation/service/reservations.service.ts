import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Message } from 'src/app/model/Message';
import { CookieService } from 'ngx-cookie-service';
import { ReservationRequest } from '../model/ReservationRequest';
import { ReservationResponse } from '../model/ReservationResponse';


@Injectable({
  providedIn: 'root'
})
export class ReservationsService {
  readonly GET_RESERVATIONS = 'http://localhost:8080/api/reservations/list';
  readonly POST_RESERVATIONS = 'http://localhost:8080/api/reservations';
  readonly DEL_RESERVATIONS = 'http://localhost:8080/api/reservations/2';
  

  constructor(private http: HttpClient, private cookieService: CookieService) { }

  getReservations(): Observable<ReservationResponse[]>{
    let enco: any = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    return this.http.get<ReservationResponse[]>(this.GET_RESERVATIONS, {headers: enco, withCredentials: true});
  }

  /** POST: add a new Reservation to the database */
  postReservation(reservationRequest: ReservationRequest): any {
    let enco: any = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post<ReservationResponse>(this.POST_RESERVATIONS, reservationRequest, {headers: enco, withCredentials: true});
  }

  deleteReservation(id: number): any {
    return this.http.delete(this.DEL_RESERVATIONS)  
  }

  private handleError<T>(operation = 'operation') {
    return (error: any): Observable<Message> => {
      return of(new Message(error.message));
    };
  }
}
