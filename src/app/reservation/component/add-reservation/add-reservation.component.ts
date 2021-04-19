import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from "@angular/forms";
import { DatePipe } from '@angular/common';
import { UsersService } from 'src/app/service/users.service';
import { FloorsService } from 'src/app/service/floors.service';
import { RoomsService } from 'src/app/service/rooms.service';
import { WorksitesService } from 'src/app/service/worksites.service';
import { UserResponseDto } from 'src/app/model/UserResponseDto';
import { Room } from 'src/app/model/Room';
import { Worksite } from 'src/app/model/Worksite';
import { ReservationsService } from '../../service/reservations.service';
import { ReservationRequest } from '../../model/ReservationRequest';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';

export interface ReservatedWorkSite{
    owner:	UserResponseDto;
    floorNumber: number;
    roomName: string;
    worksite: Worksite;
    startDate: string
    endDate: string;
}

@Component({
    selector: 'app-add-reservation',
    templateUrl: './add-reservation.component.html',
    styleUrls: ['./add-reservation.component.css']
})

export class AddReservationComponent implements OnInit{
    constructor(
        protected router: Router, 
        protected keycloakService: AuthService,
        private usersService: UsersService,
        private floorsService: FloorsService,
        private roomsService: RoomsService,
        private worksiteService: WorksitesService,
        private reservationService: ReservationsService,
        private datepipe: DatePipe,
        private _snackBar: MatSnackBar,             
    ) {}


    dateRange = new FormGroup({
        start: new FormControl(),
        end: new FormControl()
    });

    availableRooms = true;
    selectableAvailableRooms = false;

    defualtFloor: number = 1;
    lastWorksite: Worksite = {roomId:0, worksiteId: 0,worksiteInRoomId: 0};
    
    user: any;
    removable = true;
    visibleWorkSitesChips = true;
    addOnBlurWorkSitesChips = true;
    selectableWorkSitesChips = true;
    usersList: UserResponseDto[] = [];
    floors: number[] = [];
    roomsList: Room[] = [];
    worksitesList: Worksite[] = [];
    reservatedWorkSites: ReservatedWorkSite[] = [];  
    reservation: ReservationRequest;

    ngOnInit(): void {
        this.user = this.keycloakService.getLoggedUser();
        //this.getUsers();
        //this.getFloors();

    }

    getUsers(): void{
        this.usersService.getUsers().subscribe(
        users => this.usersList = users
        );
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

    getRooms(floors?: number, start?:Date, end?:Date): void{
        if(start < end){
            this.roomsService.getRooms(floors.toString(), start, end).subscribe(
            rooms => this.roomsList = rooms
            );
            this.worksitesList = [];
        }
    }

    getWorksites(roomId?: string, start?:Date, end?:Date){
        this.worksiteService.getWorksites(roomId[roomId.length-1], start, end).subscribe(
        worksite => {this.worksitesList = worksite;}
        )
    }

    postReservations(floor?:number, start?:Date, end?:Date){

        for(var reservatedWorkSite of this.reservatedWorkSites){
            this.reservation = {
                startDate:reservatedWorkSite.startDate,
                endDate:reservatedWorkSite.endDate,
                ownerId:reservatedWorkSite.owner.id,
                worksiteId:reservatedWorkSite.worksite.worksiteId
            };
            this.reservationService.postReservation( this.reservation )
                .subscribe(msg => {
                console.log(msg); // RservationResponse
                this.showToast('Udało się dokonać rezerwacji', 'OK');
                }, error => {
                console.log(error.message);
                this.showToast('Nie udało się dokonać rezerwacji', 'OK');
                });
        }
        this.reservatedWorkSites = [];
        this.getRooms(floor, start,end);
        this.worksitesList = [];        
    }

    addChipToList(  
        owner:	UserResponseDto,
        floorNumber: number,
        roomName: string,
        worksite: Worksite,
        startDate: Date,
        endDate: Date
    ): void{
        if(this.lastWorksite.worksiteId === worksite.worksiteId){
            this.showToast('Wybierz inne stanowisko', 'OK');
        }else{
            var date = new Date();
            if(startDate < date){
                this.showToast('Wybrany termin jest nie poprawny(na dzisiaj też nie można)', 'OK');
            }else{
                this.lastWorksite = {
                    roomId: worksite.roomId,
                    worksiteId: worksite.worksiteId,
                    worksiteInRoomId: worksite.worksiteInRoomId};

                let start = this.datepipe.transform(startDate, 'yyyy-MM-dd');
                let end = this.datepipe.transform(endDate, 'yyyy-MM-dd');

                if(!this.checkIfChipExist(worksite, start, end)){
                    this.reservatedWorkSites.push({owner, floorNumber, roomName, worksite, startDate:start, endDate:end});
                }
            }
        }
    }

  // Backend accepts many of the same bookings to the base. The method can be saved for backend testing.
  // check(owner:	UserResponseDto,
  //     floorNumber: number,
  //     roomName: string,
  //     worksite: Worksite,
  //     startDate: string,
  //     endDate: string){
  //       for(let i of this.reservatedWorkSites){
  //         if(i.owner === owner && i.floorNumber === floorNumber && i.roomName === roomName &&
  //           i.worksite.worksiteId === worksite.worksiteId && i.startDate === startDate && i.endDate === endDate){
  //             return true;
  //           }
  //       }
  //       return false;
  //     }  

    checkIfChipExist( worksite: Worksite, startDate: string, endDate: string ) {
        
        for(let i of this.reservatedWorkSites){
            if(i.worksite.worksiteId === worksite.worksiteId && i.startDate === startDate && i.endDate === endDate){
                this.showToast('Rezerwacja na to miejsce jest już w liście', 'OK');
                return true;
            }
            if(i.worksite.worksiteId === worksite.worksiteId && (i.startDate < startDate && i.endDate > startDate)){
                this.showToast('To miejsce w tym terminie znajduje się już w liście', 'OK');
                return true;
            }
        }
        return false;
    }

    checkIndexChipInList( 
        owner:	UserResponseDto,
        floorNumber: number,
        roomName: string,
        worksite: Worksite,
        startDate: string,
        endDate: string 
    ){
        let k = 0;
        for(let i of this.reservatedWorkSites){
        if(i.owner === owner && i.floorNumber === floorNumber && i.roomName === roomName &&
            i.worksite === worksite && i.startDate === startDate && i.endDate === endDate){
            return k;
            }
            k++;
        }
    }

    removeChipFormList(reservated: ReservatedWorkSite): void{
        let index = this.checkIndexChipInList(
        reservated.owner, 
        reservated.floorNumber, 
        reservated.roomName, 
        reservated.worksite, 
        reservated.startDate, 
        reservated.endDate 
        );
        if (index >= 0){
            this.lastWorksite = {
                roomId: 0,
                worksiteId: 0,
                worksiteInRoomId: 0
            };
            this.reservatedWorkSites.splice(index, 1);
        }
    }

    showToast(message: string, action: string): void{
        this._snackBar.open(message, action);
    }
}
