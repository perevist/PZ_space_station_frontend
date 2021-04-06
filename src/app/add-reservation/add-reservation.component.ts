import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import { Floors } from '../model/Floors';
import { Room } from '../model/Room';
import { UserResponseDto } from '../model/UserResponseDto';
import {AuthenticationService} from "../service/authentication.service";
import { FloorsService } from '../service/floors.service';
import { UsersService } from '../service/users.service';
import {RoomsService} from '../service/rooms.service';
import { WorksitesService } from '../service/worksites.service';


export interface ReservatedWorkSite{
  owner:	UserResponseDto;
  floorNumber: number;
  roomName: string;
  worksiteId: number;
  rangeOfDateReservation: FormGroup;
}

@Component({
  templateUrl: './add-reservation.component.html',
  styleUrls: ['./add-reservation.component.css']
})

export class AddReservationComponent implements OnInit {
  constructor(private usersService: UsersService,
              private floorsService: FloorsService,
              private roomsService: RoomsService,
              private worksiteService: WorksitesService) { }

  rangeOfDateReservation: FormGroup = new FormGroup({
    start: new FormControl(new Date()),
    end: new FormControl(new Date())
  }); 

  reservatedWorkSites: ReservatedWorkSite[] = [];
  visibleWorkSitesChips = true;
  selectableWorkSitesChips = true;
  removableWorkSitesChips = true;
  addOnBlurWorkSitesChips = true;
  usersList: UserResponseDto[] = [];
  roomsList: Room[] = [];

  workSitesIds: number[] = [1, 2, 3, 4, 5] //TODO Zmienić przykład na interface z bazy danych

  floors: number[] = [];
  ngOnInit(): void {
    this.getUsers();
    this.getFloors();
  }

  getUsers(){
    this.usersService.getUsers().subscribe(
      users => this.usersList = users
    );
  }

  getFloors(){
    this.floorsService.getFloors().subscribe(
      numberOfFloors => {
        for(var i=1; i <= numberOfFloors.numberOfFloors; i++){
          this.floors[i] = i; 
        }
      }
    );
  }

  getRooms(){
    this.roomsService.getRooms().subscribe(
      rooms => {
        this.roomsList = rooms;
    }
    );

  }

  testpicker(picker: string){
    console.log(picker)
  }

  add(owner:	UserResponseDto,
      floorNumber: number,
      roomName: string,
      worksiteId: number,
      rangeOfDateReservation: FormGroup): void{
    
    // this.reservatedWorkSites.push({owner, floorNumber, roomName, worksiteId, startDate, endDate});
    const index = this.workSitesIds.indexOf(worksiteId);
    this.workSitesIds.splice(index, 1);
  }

  remove(workSite: ReservatedWorkSite): void{
    const index = this.reservatedWorkSites.indexOf(workSite);

    if (index >= 0){
      this.reservatedWorkSites.splice(index, 1);
      this.workSitesIds.push(workSite.worksiteId);
      this.workSitesIds.sort();
    }
  }
}
