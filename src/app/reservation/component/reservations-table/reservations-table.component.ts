import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable } from '@angular/material/table';
import { ReservationsTableDataSource } from './reservations-table-datasource';
import { ReservationResponse } from '../../model/ReservationResponse';
import { ReservationsService } from '../../service/reservations.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-reservations-table',
  templateUrl: './reservations-table.component.html',
  styleUrls: ['./reservations-table.component.css']
})

export class ReservationsTableComponent implements AfterViewInit, OnInit{
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  
  dataSource: ReservationsTableDataSource;
  reservations: MatTable<ReservationResponse>;
  
  displayedColumns: string[] = ['id', 'ownerFirstName', 'ownerLastName', 'worksiteId', 'reservationMakerFirstName', 'reservationMakerLastName', 'startDate', 'endDate', 'action'];

  constructor(private reservationsService: ReservationsService,
             private route: ActivatedRoute,
             protected router: Router, 
             protected keycloakService: AuthService,
             private _snackBar: MatSnackBar) {
  }

  // async deleteReservation(id: number){
  //   let del = await this.reservationsService.deleteReservation(id);
  //   this.dataSource.getReservations().then((reservations) => /*this.table.dataSource=reservations*/);
  //   this.showToast('Pomyślnie usunięto rezerwację', 'OK');
  // }

  ngOnInit(){
    this.reservations = this.route.snapshot.data["Reservations"];
    let user = this.keycloakService.getLoggedUser();
    this.dataSource = new ReservationsTableDataSource(this.reservationsService);
    this.dataSource.loadReservations(1, '', 'asc', 0, 3);
  }

  ngAfterViewInit(): void {
    
    this.paginator.page
            .pipe(
                tap(() => this.loadReservationsPage())
            )
            .subscribe();
  }
  loadReservationsPage(): void {
    let user = this.keycloakService.getLoggedUser();
    this.dataSource.loadReservations(
      1,
      '',
      'asc',
      this.paginator.pageIndex,
      this.paginator.pageSize);
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
