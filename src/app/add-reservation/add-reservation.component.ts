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
  worksiteId: number;
  startDate: string
  endDate: string;
 // rangeOfDateReservation: FormGroup;
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

  /*rangeOfDateReservation: FormGroup = new FormGroup({
    start: new FormControl(new Date()),
    end: new FormControl(new Date())
  }); */

  reservatedWorkSites: ReservatedWorkSite[] = [];
  reservated: ReservatedWorkSite;
  visibleWorkSitesChips = true;
  selectableWorkSitesChips = true;
  removable = true;
  addOnBlurWorkSitesChips = true;
  usersList: UserResponseDto[] = [];
  roomsList: Room[] = [];
  worksitesList: Worksite[] = [];


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

  reservation: ReservationRequest;
  postReservations(){
    for(var reservatedWorkSite of this.reservatedWorkSites){
      this.reservation = {startDate:reservatedWorkSite.startDate,
                          endDate:reservatedWorkSite.endDate,
                          ownerId:reservatedWorkSite.owner.id,
                          worksiteId:reservatedWorkSite.worksiteId};
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
      worksiteId: number,
      startDate: Date,
      endDate: Date): void{

    let start = this.datepipe.transform(startDate, 'yyyy-MM-dd');
    let end = this.datepipe.transform(endDate, 'yyyy-MM-dd');

    if(!this.check(owner, floorNumber, roomName, worksiteId, start, end)){
      this.reservatedWorkSites.push({owner, floorNumber, roomName, worksiteId, startDate:start, endDate:end});
    }
  }

  check(owner:	UserResponseDto,
      floorNumber: number,
      roomName: string,
      worksiteId: number,
      startDate: string,
      endDate: string){
        for(let i of this.reservatedWorkSites){
          if(i.owner === owner && i.floorNumber === floorNumber && i.roomName === roomName &&
            i.worksiteId === worksiteId && i.startDate === startDate && i.endDate === endDate){
              return true;
            }
        }
        return false;
      }


  checkIndex(owner:	UserResponseDto,
    floorNumber: number,
    roomName: string,
    worksiteId: number,
    startDate: string,
    endDate: string){
      let k = 0;
      for(let i of this.reservatedWorkSites){
        if(i.owner === owner && i.floorNumber === floorNumber && i.roomName === roomName &&
          i.worksiteId === worksiteId && i.startDate === startDate && i.endDate === endDate){
            return k;
          }
          k++;
      }
    }

  remove(reservated: ReservatedWorkSite): void{

    let index = this.checkIndex(reservated.owner, reservated.floorNumber, reservated.roomName, reservated.worksiteId, reservated.startDate, reservated.endDate);
    if (index >= 0){
      this.reservatedWorkSites.splice(index, 1);
    }
  }
}
