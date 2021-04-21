import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { catchError, finalize, map } from 'rxjs/operators';
import { Observable, of as observableOf, merge, BehaviorSubject, of } from 'rxjs';
import { ReservationsService } from '../../service/reservations.service';
import { ReservationResponse } from '../../model/ReservationResponse';
import { Component, Directive, Injectable, OnInit } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';

@Injectable({
    providedIn: 'root',
})
export class ReservationsTableDataSource implements DataSource<ReservationResponse> {

  private reservationsSubject = new BehaviorSubject<ReservationResponse[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);

  public loading$ = this.loadingSubject.asObservable();

  constructor(private reservationsService: ReservationsService) {}

  connect(collectionViewer: CollectionViewer): Observable<ReservationResponse[]> {
    return this.reservationsSubject.asObservable();
}

disconnect(collectionViewer: CollectionViewer): void {
  this.reservationsSubject.complete();
  this.loadingSubject.complete();
}

loadReservations(id: number, filter = '',
                sortDirection = 'asc', pageIndex = 0, pageSize = 3) {

        this.loadingSubject.next(true);

        this.reservationsService.findReservations(id, filter, sortDirection,
            pageIndex, pageSize).pipe(
            catchError(() => of([])),
            finalize(() => this.loadingSubject.next(false))
        )
        .subscribe(reservations => this.reservationsSubject.next(reservations));
}    

}
function compare(a: string | number, b: string | number, isAsc: boolean): number {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
