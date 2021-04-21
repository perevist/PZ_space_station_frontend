import { Component, OnInit } from '@angular/core';
import { FloorsService } from 'src/app/view/service/floors.service';

@Component({
  selector: 'app-add-room',
  templateUrl: './add-room.component.html',
  styleUrls: ['./add-room.component.css']
})
export class AddRoomComponent implements OnInit {

  floors: number[] = [];

  constructor(
    private floorsService: FloorsService
  ) { }

  ngOnInit(): void { 
    this.getFloors();
  }

  getFloors(): void{
    this.floorsService.getFloors().subscribe(
    numberOfFloors => {
        for(var i=1; i <= numberOfFloors.numberOfFloors; i++){
        this.floors[i] = i;
        }
    }
    );
}

  postRoom(
    floorNumber: number,
    roomName: string,
    workSiteNumber: number
  ): void{

  }

}
