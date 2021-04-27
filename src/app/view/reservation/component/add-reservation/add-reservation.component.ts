import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from "@angular/forms";
import { DatePipe } from '@angular/common';
import { UsersService } from 'src/app/view/service/users.service';
import { FloorsService } from 'src/app/view/service/floors.service';
import { RoomsService } from 'src/app/view/room/service/rooms.service';
import { WorksitesService } from 'src/app/view/service/worksites.service';
import { UserResponseDto } from 'src/app/view/model/UserResponseDto';
import { Room } from 'src/app/view/room/model/Room';
import { Worksite } from 'src/app/view/model/Worksite';
import { ReservationsService } from '../../service/reservations.service';
import { ReservationRequest } from '../../model/ReservationRequest';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/view/service/auth.service';
import { DataflowService } from '../../service/dataflow.service';
import { Subscription } from 'rxjs';
import { KeycloakProfile} from 'keycloak-js'

export interface ReservatedWorkSite{
    owner:	KeycloakProfile;
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

export class AddReservationComponent implements OnDestroy ,OnInit{
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
        private dataService: DataflowService,
    ) {}


    dateRange = new FormGroup({
        start: new FormControl(),
        end: new FormControl()
    });


    subscription: Subscription;
    availableRooms = true;
    selectableAvailableRooms = false;

    reservationToModify: any = {};
    preparedReservationToInput: any = {};

    defualtFloor: number = 1;
    lastWorksite: Worksite = {roomId:0, worksiteId: 0,worksiteInRoomId: 0};
    title: string;
    
    user: any;
    removable = true;
    visibleWorkSitesChips = true;
    addOnBlurWorkSitesChips = true;
    selectableWorkSitesChips = true;
    usersList: KeycloakProfile[] = [];
    floors: number[] = [];
    roomsList: Room[] = [];
    worksitesList: Worksite[] = [];
    reservatedWorkSites: ReservatedWorkSite[] = [];  
    reservation: ReservationRequest;


    ngOnInit(): void {
        this.getWorksites();
        this.getFloors();
        this.getRooms();
        this.getUsers();
        setTimeout(() =>{
        this.subscription = this.dataService.currentReservation.subscribe(reservation => this.reservationToModify = reservation);
        if(this.reservationToModify.worksiteId){
            this.prepareDataToInput();
            this.title = 'Zmodyfikuj rezerwację';
            console.log(this.preparedReservationToInput);
        }else{
            this.title = 'Dodaj rezerwacje';
        };
        this.user = this.keycloakService.getLoggedUser();
        console.log(this.reservationToModify);}, 300);

    }

    ngOnDestroy(): void{
        this.subscription.unsubscribe();
    }

    getUsers(): void{
        this.usersService.getUsers().subscribe(
            users => this.usersList = users
        );
        
    }

    prepareDataToInput(): void{

        let startDate = new Date(this.reservationToModify.startDate);
        let endDate = new Date(this.reservationToModify.endDate);
        let user = this.reservationToModify.ownerFirstName + ' ' + this.reservationToModify.ownerLastName;
        let worksite = this.reservationToModify.worksiteId;
        let room;
        let floor;
        for(let ws of this.worksitesList){
            if(ws.worksiteId === worksite){
                room = ws.roomId;
                worksite = ws.worksiteInRoomId;
                break;
            }
        }
        for(let rm of this.roomsList){
            if(rm.id === room){
                floor = rm.floor;
            }
        }
        room = 'Pokój ' + room;
        this.preparedReservationToInput = {user: user, startDate: startDate, endDate: endDate, worksiteId: worksite, roomId: room, floor: floor};
        this.getRooms(this.reservationToModify.floor, this.reservationToModify.startDate, this.reservationToModify.endDate);
        this.getWorksites(this.reservationToModify.roomId, this.reservationToModify.startDate, this.reservationToModify.endDate);
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
        if(floors !== undefined){
            if(start < end){
                this.roomsService.getRooms(floors, start, end).subscribe(
                rooms => this.roomsList = rooms
                );
                this.worksitesList = [];
        }}else{
            this.roomsService.getRooms().subscribe(
                rooms => this.roomsList = rooms
                );
        }
    }

    async getWorksites(roomId?: number, start?:Date, end?:Date){
        if(roomId !== undefined){
            await this.worksiteService.getWorksites(roomId, start, end).then((worksites) => this.worksitesList = worksites);
            console.log(this.worksitesList);
           // this.worksiteService.getWorksites(roomId[roomId.length-1], start, end).subscribe(
           // worksite => {this.worksitesList = worksite;}
        }else{
            await this.worksiteService.getWorksites().then((worksites) => this.worksitesList = worksites);
        };
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
        owner:	KeycloakProfile,
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
                    this.reservatedWorkSites.push({owner , floorNumber, roomName, worksite, startDate:start, endDate:end});
                }
            }
        }
    }

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
        owner:	KeycloakProfile,
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
