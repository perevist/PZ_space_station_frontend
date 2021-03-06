import { AfterViewInit, Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { DataSource } from '@angular/cdk/collections';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTable } from '@angular/material/table';
import { ReservationsTableDataSource } from './reservations-table-datasource';
import { ReservationResponse } from '../../model/ReservationResponse';
import { ReservationsService } from '../../service/reservations.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/view/service/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DataflowService } from '../../service/dataflow.service';
import { Subscription } from 'rxjs';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-reservations-table',
  templateUrl: './reservations-table.component.html',
  styleUrls: ['./reservations-table.component.css']
})

export class ReservationsTableComponent implements AfterViewInit, OnInit, OnDestroy{

  @ViewChild(MatTable) table!: MatTable<ReservationResponse>;

  dataSource: ReservationsTableDataSource;
  reservation: any;
  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns: string[] = ['ownerName', 'floor', 'room', 'worksiteInRoomId', 'reservationMakerName', 'startDate', 'endDate', 'action'];
  subscription: Subscription;
  pageIndex: number=1;
  userId: string;
  offset: number=11;
  pageSize: number=10;
  past: boolean = false;

  constructor(private reservationsService: ReservationsService,
             protected router: Router, 
             protected keycloakService: AuthService,
             private _snackBar: MatSnackBar,
             private dataService: DataflowService) {
    this.dataSource = new ReservationsTableDataSource(this.reservationsService, this.keycloakService);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit(){
    this.subscription = this.dataService.currentReservation.subscribe(reservation => this.reservation = reservation);
    let user = this.keycloakService.getLoggedUser();
    this.userId = user["sub"];
  }

  ngAfterViewInit(): void {
    this.dataSource.getReservations(this.pageIndex, this.userId, this.past).then((reservations) => {
        this.dataSource.getReservations(this.pageIndex+1, this.userId, this.past).then((r) => {
            if(this.dataSource.reservations.length === 0){
                this.offset = (this.pageIndex - 1) * this.pageSize + reservations.length;
            }else{
                this.offset = (this.pageIndex) * this.pageSize + this.dataSource.reservations.length
            }
        });
      this.table.dataSource=reservations});
  }

  getNext(event: PageEvent) {
    this.pageIndex = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.dataSource.getReservations(this.pageIndex, this.userId, this.past).then((reservations) => { 
        this.dataSource.getReservations(this.pageIndex+1, this.userId, this.past).then((r) => {
            if(this.dataSource.reservations.length === 0){
                console.log(this.pageIndex);
                this.offset = (this.pageIndex - 1) * this.pageSize + reservations.length;
            }else{
                this.offset = (this.pageIndex) * this.pageSize + this.dataSource.reservations.length
            }
        });
  
    this.table.dataSource=reservations});
  }    

  change($event: MatSlideToggleChange){
      this.past = $event.checked;
      
      this.dataSource.getReservations(this.pageIndex, this.userId, this.past).then((reservations) =>  {
        this.dataSource.getReservations(this.pageIndex+1, this.userId, this.past).then((r) => {
            if(this.dataSource.reservations.length === 0){
                this.offset = (this.pageIndex - 1) * this.pageSize + reservations.length;
            }else{
                this.offset = (this.pageIndex) * this.pageSize + this.dataSource.reservations.length
            }
        });
        this.table.dataSource=reservations;
    });
  }

  async deleteReservation(id: number){
    let del = await this.reservationsService.deleteReservation(id);
    this.dataSource.getReservations(this.pageIndex, this.userId, this.past).then((reservations) =>  {
        this.dataSource.getReservations(this.pageIndex+1, this.userId, this.past).then((r) => {
            if(this.dataSource.reservations.length === 0){
                this.offset =(this.pageIndex - 1) * this.pageSize + reservations.length;
            }else{
                this.offset = this.pageIndex * this.pageSize + this.dataSource.reservations.length
            }
        });
      this.table.dataSource=reservations});
      
    this.showToast('Pomy??lnie usuni??to rezerwacj??', 'OK');
  }

    

  goToAddReservations($myParam: string = ''): void {
    this.dataService.changeReservation({});
    const navigationDetails: string[] = ['/add-reservation'];
    if($myParam.length) {
      navigationDetails.push($myParam);
    }
    this.router.navigate(navigationDetails);
  }
  
  goToEditReservations(reservation: any, $myParam: string = ''): void {
    this.dataService.changeReservation(reservation);
    const navigationDetails: string[] = ['/edit-reservation'];
    if($myParam.length) {
      navigationDetails.push($myParam);
    }
    this.router.navigate(navigationDetails);
  }

  showToast(message: string, action: string): void{
    this._snackBar.open(message, action);
  }
}
function pageIndex(pageIndex: any) {
  throw new Error('Function not implemented.');
}

