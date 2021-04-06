import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, MatSortable } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { ReservationsTableDataSource } from './reservations-table-datasource';
import { Reservation } from 'src/app/model/ReservationRequest';
import { ReservationsService } from 'src/app/service/reservations.service';

@Component({
  selector: 'app-reservations-table',
  templateUrl: './reservations-table.component.html',
  styleUrls: ['./reservations-table.component.css']
})
export class ReservationsTableComponent implements AfterViewInit{
 // @ViewChild(MatPaginator) paginator!: MatPaginator;
 // @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<Reservation>;
  dataSource: ReservationsTableDataSource;

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns: string[] = ['id', 'ownerFirstName', 'ownerLastName', 'worksiteId', 'reservationMakerFirstName', 'reservationMakerLastName', 'startDate', 'endDate'];

  constructor(private reservationsService: ReservationsService) {
    this.dataSource = new ReservationsTableDataSource(this.reservationsService);
  }


  ngAfterViewInit(): void {
//    this.dataSource.sort = this.sort;
//    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;

  }
}
