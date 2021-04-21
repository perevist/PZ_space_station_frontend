import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, MatSortable } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { ReservationsTableDataSource } from './reservations-table-datasource';
import { ReservationResponse } from '../../model/ReservationResponse';
import { ReservationsService } from '../../service/reservations.service';
import { Router } from '@angular/router';
<<<<<<< HEAD:src/app/view/reservation/component/reservations-table/reservations-table.component.ts
import { AuthService } from 'src/app/view/service/auth.service';
=======
import { AuthService } from 'src/app/service/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
>>>>>>> 0a6e1903f7302dd6388b3c42120d0b676f260605:src/app/reservation/component/reservations-table/reservations-table.component.ts

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
  displayedColumns: string[] = ['id', 'ownerFirstName', 'ownerLastName', 'worksiteId', 'reservationMakerFirstName', 'reservationMakerLastName', 'startDate', 'endDate', 'action'];

  constructor(private reservationsService: ReservationsService,
             protected router: Router, 
             protected keycloakService: AuthService,
             private _snackBar: MatSnackBar) {
    this.dataSource = new ReservationsTableDataSource(this.reservationsService);
  }

  async deleteReservation(id: number){
    let del = await this.reservationsService.deleteReservation(id);
    this.dataSource.getReservations().then((reservations) => this.table.dataSource=reservations);
    this.showToast('Pomyślnie usunięto rezerwację', 'OK');
  }

  ngOnInit(){
    let user = this.keycloakService.getLoggedUser();
  }

  ngAfterViewInit(): void {
//    this.dataSource.sort = this.sort;
//    this.dataSource.paginator = this.paginator;
    this.dataSource.getReservations().then((reservations) => this.table.dataSource=reservations);
  }

  goToAddReservations($myParam: string = ''): void {
    const navigationDetails: string[] = ['/add-reservation'];
    if($myParam.length) {
      navigationDetails.push($myParam);
    }
    this.router.navigate(navigationDetails);
  }

  showToast(message: string, action: string): void{
    this._snackBar.open(message, action);
  }
}
