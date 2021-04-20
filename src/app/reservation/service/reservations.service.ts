import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Message } from 'src/app/model/Message';
import { CookieService } from 'ngx-cookie-service';
import { ReservationRequest } from '../model/ReservationRequest';
import { ReservationResponse } from '../model/ReservationResponse';
import { KeycloakService } from 'keycloak-angular';
import { AuthService } from 'src/app/service/auth.service';


@Injectable({
  providedIn: 'root'
})
export class ReservationsService {

  readonly GET_RESERVATIONS = 'http://localhost:8081/api/reservations/list';
  readonly POST_RESERVATIONS = 'http://localhost:8081/api/reservations';
  readonly DEL_RESERVATIONS = 'http://localhost:8081/api/reservations/';
  
  constructor(private http: HttpClient, //private cookieService: CookieService,
            private keycloakService: AuthService) { }

  getReservations(): Promise<ReservationResponse[]>{
    console.log(this.keycloakService.getToken());
    return this.http.get<ReservationResponse[]>(this.GET_RESERVATIONS).toPromise();
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
