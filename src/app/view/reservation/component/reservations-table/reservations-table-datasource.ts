import { DataSource } from '@angular/cdk/collections';
import { Observable, of as observableOf, merge } from 'rxjs';
import { ReservationsService } from '../../service/reservations.service';
import { ReservationResponse } from '../../model/ReservationResponse';
import { Injectable, OnInit } from '@angular/core';
import { AuthService } from 'src/app/view/service/auth.service';

@Injectable({
    providedIn: 'root',
})
export class ReservationsTableDataSource extends DataSource<ReservationResponse> implements OnInit{
  data: ReservationResponse[];
  reservations: ReservationResponse[] = [];
  user: any;
  userId: any;

    constructor(private reservationsService: ReservationsService,
        protected keycloakService: AuthService) {
        super();
    }
    ngOnInit(): void {
        this.user = this.keycloakService.getLoggedUser();
        this.userId = this.user["sub"];
    }

    async getReservations(pageIndex: number, userId: string, past: boolean): Promise<ReservationResponse[]>{
        this.reservations = await this.reservationsService.getReservations(pageIndex, userId, past);
        return this.reservations;
    }

    connect(): Observable<ReservationResponse[]> {
        return observableOf(this.reservations);
    }


  disconnect(): void {}

}
