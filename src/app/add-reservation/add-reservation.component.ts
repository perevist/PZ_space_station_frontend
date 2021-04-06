import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import { Floors } from '../model/Floors';
import { UserResponseDto } from '../model/UserResponseDto';
import {AuthenticationService} from "../service/authentication.service";
import { FloorsService } from '../service/floors.service';
import { UsersService } from '../service/users.service';


export interface ReservatedWorkSite{
  room: number;
  workSite: number;
}

@Component({
  templateUrl: './add-reservation.component.html',
  styleUrls: ['./add-reservation.component.css']
})

export class AddReservationComponent implements OnInit {
  constructor(private authService: AuthenticationService,
              private usersService: UsersService,
              private floorsService: FloorsService) { }

  reservatedWorkSites: ReservatedWorkSite[] = [];
  visibleWorkSitesChips = true;
  selectableWorkSitesChips = true;
  removableWorkSitesChips = true;
  addOnBlurWorkSitesChips = true;
  usersList: UserResponseDto[] = [];

  /*reservationControl: FormGroup = new FormGroup({
    startDate: new FormControl('', [Validators.required, Validators.min(3)]),
    endDate: new FormControl('', [Validators.required, Validators.min(3)]),
    ownerFirstName: new FormControl('', [Validators.required, Validators.min(3)]),
    workSiteId: new FormControl('', [Validators.required, Validators.min(3)]),
    roomId: new FormControl('', [Validators.required, Validators.min(3)])
  });*/

  rooms: number[] = [1, 2, 3, 4, 5]; //TODO Zmienić przykład na interface z bazy danych
  workSitesIds: number[] = [1, 2, 3, 4, 5] //TODO Zmienić przykład na interface z bazy danych

  numberOfFloors: Floors;
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
      numberOfFloors => this.numberOfFloors = numberOfFloors
    );
    console.log(this.numberOfFloors);
    //for(var i=0; i < +this.numberOfFloors.numberOfFloors; i++){
    //  this.floors[i] = i+1; 
    //}

  }

  add(room:number, workSite:number):void{
    this.reservatedWorkSites.push({room: room, workSite:workSite});
    const index = this.workSitesIds.indexOf(workSite);
    this.workSitesIds.splice(index, 1);
  }

  remove(workSite: ReservatedWorkSite): void{
    const index = this.reservatedWorkSites.indexOf(workSite);

    if (index >= 0){
      this.reservatedWorkSites.splice(index, 1);
      this.workSitesIds.push(workSite.workSite);
      this.workSitesIds.sort();
    }
  }

  /*reservationRequest: ReservationRequest;

  onSubmit() {

  }*/
}
