import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/view/service/auth.service';
import { Room } from '../../model/Room';
import { ViewRoomsService } from '../../service/view-rooms.service';
import { RoomDataSource } from './rooms.datasoource';

@Component({
  selector: 'app-view-room',
  templateUrl: './view-room.component.html',
  styleUrls: ['./view-room.component.css']
})

export class ViewRoomComponent implements AfterViewInit, OnInit {

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns: string[] = [
    'id', 
    'floorNumber', 
    'roomName', 
    'worksidesNumber'
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatTable) table!: MatTable<Room>;
  roomsList: Room[]=[];
  dataSource: any;

  constructor(
    private roomsService: ViewRoomsService,
    protected router: Router, 
    protected keycloakService: AuthService
  ) {}

  ngAfterViewInit(): void {
    // this.dataSource.paginator = this.paginator;
  }

  ngOnInit(): void {
    let user = this.keycloakService.getLoggedUser();
    this.roomsService.getRooms().then((roomsList) => {
      this.roomsList=roomsList;
      this.dataSource = new MatTableDataSource<Room>(this.roomsList);
      this.paginator._intl.itemsPerPageLabel = "Liczba elementów na stronie: ";
      this.dataSource.paginator = this.paginator;      
    });

  }

  goToAddRoom($myParam: string = ''): void {
    const navigationDetails: string[] = ['room/add'];
    if($myParam.length) {
      navigationDetails.push($myParam);
    }
    console.log(navigationDetails);
    console.log(this.router);

    this.router.navigate(navigationDetails);
  }

}
