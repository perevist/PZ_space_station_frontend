import { DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { map } from 'rxjs/operators';
import { Observable, of as observableOf, merge } from 'rxjs';
import { ReservationsService } from '../../service/reservations.service';
import { ReservationResponse } from '../../model/ReservationResponse';
import { Component, Directive, Injectable, OnInit } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';

@Injectable({
    providedIn: 'root',
})
export class ReservationsTableDataSource extends DataSource<ReservationResponse> {
  data: ReservationResponse[];
  reservations: ReservationResponse[];

  test: ReservationResponse;
  
//  paginator: MatPaginator | undefined;
//  sort: MatSort | undefined;


    constructor(private reservationsService: ReservationsService) {
    super();
  }

    async getReservations(): Promise<ReservationResponse[]>{
        this.reservations = await this.reservationsService.getReservations();
        return this.reservations;
  }

  connect(): Observable<ReservationResponse[]> {
 //   console.log(this.sort);
 //   console.log(this.paginator);
 /*   if (this.paginator && this.sort) {
      return merge(observableOf(this.data), this.paginator.page, this.sort.sortChange)
        .pipe(map(() => {
          return this.getPagedData(this.getSortedData([...this.data ]));
        }));
    } else {
      throw Error('Please set the paginator and sort on the data source before connecting.');
    }*/
    //console.log(this.reservations[0]);
    return observableOf(this.reservations);
  }
  disconnect(): void {}
/*
  private getPagedData(data: Reservation[]): Reservation[] {
    if (this.paginator) {
      const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
      return data.splice(startIndex, this.paginator.pageSize);
    } else {
      return data;
    }
  }

  private getSortedData(data: Reservation[]): Reservation[] {
    if (!this.sort || !this.sort.active || this.sort.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      const isAsc = this.sort?.direction === 'asc';
      switch (this.sort?.active) {
        case 'id': return compare(+a.id, +b.id, isAsc);
        case 'ownerFirstName': return compare(a.ownerFirstName, b.ownerFirstName, isAsc);
        case 'ownerLastName': return compare(a.ownerLastName, b.ownerLastName, isAsc);
        case 'worksiteId': return compare(+a.workSiteId, +b.workSiteId, isAsc);
        case 'startDate': return compare(a.startDate, b.startDate, isAsc);
        case 'endDate': return compare(a.endDate, b.endDate, isAsc);
        default: return 0;
      }
    });
  }*/
}

function compare(a: string | number, b: string | number, isAsc: boolean): number {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
