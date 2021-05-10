import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Message } from '../../model/Message';
import { CookieService } from 'ngx-cookie-service';
import { ReservationRequest } from '../model/ReservationRequest';
import { ReservationResponse } from '../model/ReservationResponse';
import { KeycloakService } from 'keycloak-angular';
import { AuthService } from '../../service/auth.service';
import { DatePipe } from '@angular/common';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class ReservationsService {

  readonly GET_RESERVATIONS = 'http://localhost:8081/api/reservations/list';
  readonly POST_RESERVATIONS = 'http://localhost:8081/api/reservations';
  readonly DEL_RESERVATIONS = 'http://localhost:8081/api/reservations/';
  readonly PUT_RESERVATION = 'http://localhost:8081/api/reservations/';
  
  constructor(private http: HttpClient, 
            private keycloakService: AuthService,
            private datepipe: DatePipe) { }

  getReservations(pageIndex: number, ownerId: string, past?: boolean): Promise<ReservationResponse[]>{
    if (!past){
        let today = this.datepipe.transform(new Date(), 'yyyy-MM-dd');
        let endDate = this.datepipe.transform(new Date(3000000000000), 'yyyy-MM-dd');
        return this.http.get<ReservationResponse[]>(this.GET_RESERVATIONS + "?endDate=" + endDate + "&page=" + pageIndex + "&ownerId=" + ownerId + "&startDate=" + today).toPromise();
    }else if (past){
        let today = this.datepipe.transform(new Date(), 'yyyy-MM-dd');
        let startDate = this.datepipe.transform(new Date(0),'yyyy-MM-dd');
        return this.http.get<ReservationResponse[]>(this.GET_RESERVATIONS + "?endDate=" + today + "&page=" + pageIndex + "&ownerId=" + ownerId + '&startDate=' + startDate).toPromise();
    }

    return this.http.get<ReservationResponse[]>(this.GET_RESERVATIONS+ "?page=" + pageIndex + "&ownerId=" + ownerId).toPromise();
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

  putReservation(id: number, reservationRequest: ReservationRequest){
    let enco: any = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.put<ReservationResponse>(this.PUT_RESERVATION+id.toString(), reservationRequest, {headers: enco});
  }

  private handleError<T>(operation = 'operation') {
    return (error: any): Observable<Message> => {
      return of(new Message(error.message));
    };
  }
}
