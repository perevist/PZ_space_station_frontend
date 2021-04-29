import { AfterViewInit, Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, MatSortable } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { ReservationsTableDataSource } from './reservations-table-datasource';
import { ReservationResponse } from '../../model/ReservationResponse';
import { ReservationsService } from '../../service/reservations.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/view/service/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DataflowService } from '../../service/dataflow.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-reservations-table',
  templateUrl: './reservations-table.component.html',
  styleUrls: ['./reservations-table.component.css']
})

export class ReservationsTableComponent implements AfterViewInit, OnInit, OnDestroy{
 // @ViewChild(MatPaginator) paginator!: MatPaginator;
 // @ViewChild(MatSort) sort!: MatSort;

  @ViewChild(MatTable) table!: MatTable<ReservationResponse>;
  dataSource: ReservationsTableDataSource;
  reservation: any;
  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns: string[] = ['id', 'ownerFirstName', 'ownerLastName', 'worksiteId', 'reservationMakerFirstName', 'reservationMakerLastName', 'startDate', 'endDate', 'action'];
  subscription: Subscription;

  constructor(private reservationsService: ReservationsService,
             protected router: Router, 
             protected keycloakService: AuthService,
             private _snackBar: MatSnackBar,
             private dataService: DataflowService) {
    this.dataSource = new ReservationsTableDataSource(this.reservationsService);
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  async deleteReservation(id: number){
    let del = await this.reservationsService.deleteReservation(id);
    this.dataSource.getReservations().then((reservations) => this.table.dataSource=reservations);
    this.showToast('Pomyślnie usunięto rezerwację', 'OK');
  }

  ngOnInit(){
    
    this.subscription = this.dataService.currentReservation.subscribe(reservation => this.reservation = reservation);
    let user = this.keycloakService.getLoggedUser();
    console.log(user);
  }

  ngAfterViewInit(): void {
//    this.dataSource.sort = this.sort;
//    this.dataSource.paginator = this.paginator;
    this.dataSource.getReservations().then((reservations) => this.table.dataSource=reservations);
  }

  goToAddReservations(modify: boolean, $myParam: string = ''): void {
    if (modify !== true){
        this.dataService.changeReservation({});
    }
    const navigationDetails: string[] = ['/add-reservation'];
    if($myParam.length) {
      navigationDetails.push($myParam);
    }
    this.router.navigate(navigationDetails);
  }

  modifyReservation(reservation: any){
      this.dataService.changeReservation(reservation);
      this.goToAddReservations(true);
  }

  showToast(message: string, action: string): void{
    this._snackBar.open(message, action);
  }
}
