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
import { Worksite } from '../model/Worksite';
import { DatePipe } from '@angular/common';
import { ReservationsService } from '../service/reservations.service';
import {ReservationRequest} from '../model/ReservationRequest';


export interface ReservatedWorkSite{
  owner:	UserResponseDto;
  floorNumber: number;
  roomName: string;
  worksite: Worksite;
  startDate: string
  endDate: string;
}

@Component({
  templateUrl: './add-reservation.component.html',
  styleUrls: ['./add-reservation.component.css']
})

export class AddReservationComponent implements OnInit {
  constructor(private usersService: UsersService,
              private floorsService: FloorsService,
              private roomsService: RoomsService,
              private worksiteService: WorksitesService,
              private reservationService: ReservationsService,
              private datepipe: DatePipe) { }

  dateRange = new FormGroup({
    start: new FormControl(),
    end: new FormControl()
  });

  visibleWorkSitesChips = true;
  selectableWorkSitesChips = true;
  removable = true;
  addOnBlurWorkSitesChips = true;
  floors: number[] = [];
  usersList: UserResponseDto[] = [];
  roomsList: Room[] = [];
  worksitesList: Worksite[] = [];
  
  reservatedWorkSites: ReservatedWorkSite[] = [];
  reservated: ReservatedWorkSite;
  reservation: ReservationRequest;


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

  getRooms(floors?: number, start?:Date, end?:Date){
    this.roomsService.getRooms(floors.toString(), start, end).subscribe(
      rooms => {
        this.roomsList = rooms;
    }
    );
  }

  getWorksites(roomId?: string, start?:Date, end?:Date){
    this.worksiteService.getWorksites(roomId[roomId.length-1], start, end).subscribe(
      worksite => {this.worksitesList = worksite;}
    )
  }

  postReservations(){
    for(var reservatedWorkSite of this.reservatedWorkSites){
      this.reservation = {startDate:reservatedWorkSite.startDate,
                          endDate:reservatedWorkSite.endDate,
                          ownerId:reservatedWorkSite.owner.id,
                          worksiteId:reservatedWorkSite.worksite.worksiteId};
      console.log(this.reservation);
      this.reservationService.postReservation(this.reservation)
      .subscribe(msg => {
        console.log(msg) // RservationResponse
      }, error => {
        console.log(error.message)
      });
    }
    this.reservatedWorkSites = [];
  }


  add(owner:	UserResponseDto,
      floorNumber: number,
      roomName: string,
      worksite: Worksite,
      startDate: Date,
      endDate: Date): void{

    let start = this.datepipe.transform(startDate, 'yyyy-MM-dd');
    let end = this.datepipe.transform(endDate, 'yyyy-MM-dd');

    if(!this.check(owner, floorNumber, roomName, worksite, start, end)){
      this.reservatedWorkSites.push({owner, floorNumber, roomName, worksite, startDate:start, endDate:end});
    }
  }

  check(owner:	UserResponseDto,
      floorNumber: number,
      roomName: string,
      worksite: Worksite,
      startDate: string,
      endDate: string){
        for(let i of this.reservatedWorkSites){
<<<<<<< HEAD
          if(i.owner === owner && i.floorNumber === floorNumber && i.roomName === roomName &&
            i.worksite === worksite && i.startDate === startDate && i.endDate === endDate){
=======
          if(i.floorNumber === floorNumber && i.roomName === roomName &&
            i.worksiteId === worksiteId && i.startDate === startDate && i.endDate === endDate){
>>>>>>> fef7f279a81b0b8137e88c1ab8b94edc8ef46179
              return true;
            }
        }
        return false;
      }


  checkIndex(owner:	UserResponseDto,
    floorNumber: number,
    roomName: string,
    worksite: Worksite,
    startDate: string,
    endDate: string){
      let k = 0;
      for(let i of this.reservatedWorkSites){
        if(i.owner === owner && i.floorNumber === floorNumber && i.roomName === roomName &&
          i.worksite === worksite && i.startDate === startDate && i.endDate === endDate){
            return k;
          }
          k++;
      }
    }

  remove(reservated: ReservatedWorkSite): void{
    let index = this.checkIndex(reservated.owner, reservated.floorNumber, reservated.roomName, reservated.worksite, reservated.startDate, reservated.endDate);
    if (index >= 0){
      this.reservatedWorkSites.splice(index, 1);
    }
  }
}
