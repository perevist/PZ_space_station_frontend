import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { MatTable } from '@angular/material/table';
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

  @ViewChild(MatTable) table!: MatTable<Room>;
  dataSource: RoomDataSource;
  pageIndex: number;
  pageSize: number;
  userId: any;
  offset: number;

  constructor(
    private roomsService: ViewRoomsService,
    protected router: Router, 
    protected keycloakService: AuthService
  ) { 
    this.dataSource = new RoomDataSource(this.roomsService);
  }

  ngAfterViewInit(): void {
    this.dataSource.getRooms().then((reservations) => this.table.dataSource=reservations);
  }

  ngOnInit(): void {
    let user = this.keycloakService.getLoggedUser();
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

  getNext(event: PageEvent) {
    this.pageIndex = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.dataSource.getRooms().then((reservations) => { 
      
    // if(this.dataSource.reservations.length<this.pageSize){
    //   this.offset = (event.pageIndex+1) * event.pageSize}
    // else{
    //   this.offset = (event.pageIndex+1) * event.pageSize + 1
    // }
  
    this.table.dataSource=reservations});
  }  

}
