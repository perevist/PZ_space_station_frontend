import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-add-room',
  templateUrl: './add-room.component.html',
  styleUrls: ['./add-room.component.css']
})
export class AddRoomComponent implements OnInit {

  floors: number[] = [];

  constructor() { }

  ngOnInit(): void { 
    this.getFloors();
  }

  getFloors(): void{

  }

  postRoom(
    floorNumber: number,
    roomName: string,
    workSiteNumber: number
  ): void{

  }

}
