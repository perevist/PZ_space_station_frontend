import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/view/service/auth.service';
import { FloorsService } from 'src/app/view/service/floors.service';
import { RoomsService } from '../../service/rooms.service';

@Component({
  selector: 'app-add-room',
  templateUrl: './add-room.component.html',
  styleUrls: ['./add-room.component.css']
})
export class AddRoomComponent implements OnInit {

  floors: number[] = [];

  constructor(
    protected router: Router, 
    protected keycloakService: AuthService,
    private floorsService: FloorsService,
    private roomsService: RoomsService
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
    this.roomsService.postReservation( this.reservation )
      .subscribe(msg => {
      console.log(msg); // RservationResponse
      this.showToast('Udało się dokonać rezerwacji', 'OK');
      }, error => {
      console.log(error.message);
      this.showToast('Nie udało się dokonać rezerwacji', 'OK');
      });
  }

  postReservations(floor?:number, start?:Date, end?:Date){

    for(var reservatedWorkSite of this.reservatedWorkSites){
        this.reservation = {
            startDate:reservatedWorkSite.startDate,
            endDate:reservatedWorkSite.endDate,
            ownerId:reservatedWorkSite.owner.id,
            worksiteId:reservatedWorkSite.worksite.worksiteId
        };
        
    }
    this.reservatedWorkSites = [];
    this.getRooms(floor, start,end);
    this.worksitesList = [];        
}

}
