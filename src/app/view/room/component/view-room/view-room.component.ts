import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
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
  @ViewChild(MatPaginator) paginator!: MatPaginator;  
  dataSource: RoomDataSource;
  //roomsList: any;
  pageIndex: number=1;
  pageSize: number=5;
  offset: number=6;

  constructor(
    private roomsService: ViewRoomsService,
    protected router: Router, 
    protected keycloakService: AuthService
  ) { 
    this.dataSource = new RoomDataSource(this.roomsService);
  }

  ngAfterViewInit(): void {
    this.dataSource.getRooms().then((roomsList) => { 
      
      if(this.dataSource.roomsList.length<this.pageSize){
        this.offset = (this.pageIndex+1) * this.pageSize}
      else{
        this.offset = (this.pageIndex+1) * this.pageSize + 1
      }
      
      this.table.dataSource=roomsList});
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
    this.dataSource.getRooms().then((roomsList) => { 
      
    if(this.dataSource.roomsList.length<this.pageSize){
      this.offset = (event.pageIndex+1) * event.pageSize}
    else{
      this.offset = (event.pageIndex+1) * event.pageSize + 1
    }
  
    this.table.dataSource=roomsList});
  }  

}
