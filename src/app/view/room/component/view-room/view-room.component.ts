import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/view/service/auth.service';
import { RoomsService } from '../../service/rooms.service';

@Component({
  selector: 'app-view-room',
  templateUrl: './view-room.component.html',
  styleUrls: ['./view-room.component.css']
})
export class ViewRoomComponent implements OnInit {

    /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns: string[] = [
    'id', 
    'floorNumber', 
    'roomName', 
    'worksidesNumber',
    'action'
  ];

  constructor(
    private roomsService: RoomsService,
    protected router: Router, 
    protected keycloakService: AuthService
  ) { }

  ngOnInit(): void {
    let user = this.keycloakService.getLoggedUser();
  }

  goToAddRoom(){

  }

}
