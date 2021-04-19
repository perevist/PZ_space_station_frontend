import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, MatSortable } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { ReservationsTableDataSource } from './reservations-table-datasource';
import { ReservationResponse } from '../../model/ReservationResponse';
import { ReservationsService } from '../../service/reservations.service';
import { Router } from '@angular/router';
import { KeycloakService } from 'keycloak-angular';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-reservations-table',
  templateUrl: './reservations-table.component.html',
  styleUrls: ['./reservations-table.component.css']
})

export class ReservationsTableComponent implements AfterViewInit, OnInit{
 // @ViewChild(MatPaginator) paginator!: MatPaginator;
 // @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<ReservationResponse>;
  dataSource: ReservationsTableDataSource;

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns: string[] = ['id', 'ownerFirstName', 'ownerLastName', 'worksiteId', 'reservationMakerFirstName', 'reservationMakerLastName', 'startDate', 'endDate'];

  constructor(private reservationsService: ReservationsService,
             protected router: Router, 
             protected keycloakService: AuthService) {
    this.dataSource = new ReservationsTableDataSource(this.reservationsService);
  }

  ngOnInit(){
    let user = this.keycloakService.getLoggedUser();
  }

  ngAfterViewInit(): void {
//    this.dataSource.sort = this.sort;
//    this.dataSource.paginator = this.paginator;
    setTimeout( () => {this.table.dataSource = this.dataSource;}, 500);

  }

  goToAddReservations($myParam: string = ''): void {
    const navigationDetails: string[] = ['/add-reservation'];
    if($myParam.length) {
      navigationDetails.push($myParam);
    }
    this.router.navigate(navigationDetails);
  }
}
