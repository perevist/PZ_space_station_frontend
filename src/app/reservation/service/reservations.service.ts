import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Message } from 'src/app/model/Message';
import { CookieService } from 'ngx-cookie-service';
import { ReservationRequest } from '../model/ReservationRequest';
import { ReservationResponse } from '../model/ReservationResponse';
import { KeycloakService } from 'keycloak-angular';
import { AuthService } from 'src/app/service/auth.service';
import { map } from 'rxjs/operators';


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

  deleteReservation(id: number): Promise<any>{
      console.log(this.DEL_RESERVATIONS+id);
      return this.http.delete(this.DEL_RESERVATIONS+id).toPromise();
      ;
  }

  findReservations(
    id:number, filter = '', sortOrder = 'asc',
    pageNumber = 0, pageSize = 3):  Observable<ReservationResponse[]> {

    return this.http.get(this.GET_RESERVATIONS, {
        params: new HttpParams()
            .set('reservationId', id.toString())
            .set('filter', filter)
            .set('sortOrder', sortOrder)
            .set('pageNumber', pageNumber.toString())
            .set('pageSize', pageSize.toString())
    }).pipe(
        map(res =>  res["payload"])
    );
}

  private handleError<T>(operation = 'operation') {
    return (error: any): Observable<Message> => {
      return of(new Message(error.message));
    };
  }
}
