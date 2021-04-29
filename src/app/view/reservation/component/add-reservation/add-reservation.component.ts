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
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DialogWindowComponent } from '../dialog-window/dialog-window.component';
import { runInThisContext } from 'node:vm';

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
        private dialog: MatDialog
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
    lastWorksite: Worksite = {coordinateX:-1, coordinateY: -1, roomId:0, worksiteId: 0,worksiteInRoomId: 0};
    title: string;
    
    userFromEditedReservation: KeycloakProfile;
    worskstieFromEditedReservation: Worksite = {coordinateX:-1, coordinateY: -1, roomId:0, worksiteId: 0,worksiteInRoomId: 0};
    roomFromEditedReservation: Room = {dimensionX: -1, dimensionY: -1, floor: 0, id: -1, name: '', numberOfWorksites: 0};

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
        }else{
            this.title = 'Dodaj rezerwacje';
        };
        this.user = this.keycloakService.getLoggedUser();}, 400);

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
        for (let u of this.usersList){
            if (u.firstName === this.reservationToModify.ownerFirstName && u.lastName === this.reservationToModify.ownerLastName){
                this.userFromEditedReservation = u;
                break
            }
        }
        let roomId: number;
        let floor: number;
        for(let ws of this.worksitesList){
            if(ws.worksiteId ===  this.reservationToModify.worksiteId){
                roomId = ws.roomId;
                this.worskstieFromEditedReservation = ws
                break;
            }
        }
        for(let r of this.roomsList){
            if(r.id === roomId){
                this.roomFromEditedReservation = r;
                floor = r.floor;
                break
            }
        }
        this.getRooms(floor, this.reservationToModify.startDate, this.reservationToModify.endDate);
        this.getWorksites(this.roomFromEditedReservation.id, this.reservationToModify.startDate, this.reservationToModify.endDate);
        setTimeout(() => {
            let i: number = 0;
            for(let r of this.roomsList){
                if (r.id === roomId){
                    this.roomsList[i] = this.roomFromEditedReservation;
                    break
                }
                i++;
                if(i === this.roomsList.length){
                    this.roomsList.push(this.roomFromEditedReservation);
                    this.sortRoomList();
                    break;
                }
            }
            this.worksitesList.push(this.worskstieFromEditedReservation);
            this.sortWorksiteList();
            this.preparedReservationToInput = {user: this.userFromEditedReservation, startDate: startDate, endDate: endDate,
                                            worksite: this.worskstieFromEditedReservation, room: this.roomFromEditedReservation, floor: floor};
        }, 300);
    }

    sortRoomList(): void{
        this.roomsList.sort((room1, room2) => {
            if (room1.id > room2.id){
                return 1;
            }
            if (room1.id < room2.id){
                return -1;
            }
            return 0;
        })
    }

    sortWorksiteList(): void{
        this.worksitesList.sort((worksite1, worksite2) => {
            if (worksite1.worksiteId > worksite2.worksiteId){
                return 1;
            }
            if (worksite1.worksiteId < worksite2.worksiteId){
                return -1;
            }
            return 0;
        })
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

    async getRooms(floors?: number, start?:Date, end?:Date){
        if(floors !== undefined){
            if(start < end){
                await this.roomsService.getRooms(floors, start, end).then((rooms) => this.roomsList = rooms);
                this.worksitesList = [];
        }}else{
                this.roomsList = await this.roomsService.getRooms();
        }
    }

    async getWorksites(roomId?: number, start?:Date, end?:Date){
        if(roomId !== undefined){
            await this.worksiteService.getWorksites(roomId, start, end).then((worksites) => this.worksitesList = worksites);
        }else{
            await this.worksiteService.getWorksites().then((worksites) => this.worksitesList = worksites);
        };
        if(this.reservationToModify.id !== undefined && this.preparedReservationToInput.worksite !== undefined
            && this.worksitesList.indexOf(this.worskstieFromEditedReservation) === -1){
                for(let w of this.worksitesList){
                    if(w.worksiteInRoomId === this.worskstieFromEditedReservation.worksiteInRoomId){
                        break;
                    }else if(this.worksitesList.indexOf(w) === this.worksitesList.length - 1){
                        this.worksitesList.push(this.worskstieFromEditedReservation);
                        this.sortWorksiteList();
                        break;
                    }
                }

        }
    }

    postReservations(floor?:number, start?:Date, end?:Date){
        var succeedPost = 0;
        for(var reservatedWorkSite of this.reservatedWorkSites){
            this.reservation = {
                startDate:reservatedWorkSite.startDate,
                endDate:reservatedWorkSite.endDate,
                ownerId:reservatedWorkSite.owner.id,
                worksiteId:reservatedWorkSite.worksite.worksiteId
            };
            this.reservationService.postReservation( this.reservation )
                .subscribe(msg => {
                console.log(msg); // ReservationResponse
                succeedPost++;
                if (this.reservatedWorkSites.length === 1){
                    this.openDialog('Sukces', 'Pomyślnie dodano rezerwację');
                }else if (succeedPost === this.reservatedWorkSites.length){
                    this.openDialog('Sukces', 'Pomyślnie dodano wszystkie rezerwacje');
                }
                
                }, error => {
                    console.log(error.message);
                    this.showToast('Nie udało się dokonać rezerwacji', 'OK');
                });
        }
    }

    putReservation(
        owner: KeycloakProfile,
        startDate: Date,
        endDate: Date,
        worksite: Worksite){
            let date = new Date();
            let start = new Date(this.reservationToModify.startDate).getDate();
            let end = new Date(this.reservationToModify.endDate).getDate();

            if(startDate < date){
                this.showToast('Wybrany termin jest nie poprawny(na dzisiaj też nie można)', 'OK');
            }else if(worksite.worksiteId === this.reservationToModify.worksiteId && owner.id === this.userFromEditedReservation.id &&
                 endDate.getDate() === end && startDate.getDate() === start){
                    //(endDate <= end && endDate >= start || (startDate <= end && startDate >= start))){
                this.showToast('Wybrano te same miejsce do zarezerwowania', 'OK');
            }else{
                this.reservation = {
                    ownerId: owner.id,
                    startDate: this.datepipe.transform(startDate, 'yyyy-MM-dd'),
                    endDate: this.datepipe.transform(endDate, 'yyyy-MM-dd'),
                    worksiteId: worksite.worksiteId
                }
                this.reservationService.putReservation(this.reservationToModify.id , this.reservation )
                .subscribe(msg => {
                console.log(msg); // RservationResponse
                this.openDialog('Sukces', 'Pomyślnie zmodyfikowano rezerwację');
                }, error => {
                    console.log(error.message);
                    this.showToast('Nie udało się zmodyfikować rezerwacji', 'OK');
            });
        }
    }

    openDialog(state: string, message: string){
        const dialogConfig =  new MatDialogConfig()

        dialogConfig.disableClose = true
        dialogConfig.autoFocus = true
        dialogConfig.data = {state:state, message:message}

        const dialogRef = this.dialog.open(DialogWindowComponent, dialogConfig);
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
                    coordinateX: worksite.coordinateX,
                    coordinateY: worksite.coordinateY,
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
                coordinateX: -1,
                coordinateY: -1,
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
