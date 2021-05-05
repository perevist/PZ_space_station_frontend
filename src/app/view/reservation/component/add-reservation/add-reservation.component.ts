import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { DatePipe } from '@angular/common';
import { UsersService } from 'src/app/view/service/users.service';
import { FloorsService } from 'src/app/view/service/floors.service';
import { RoomsService } from 'src/app/view/room/service/rooms.service';
import { WorksitesService } from 'src/app/view/service/worksites.service';
import { Room } from 'src/app/view/room/model/Room';
import { Worksite } from 'src/app/view/model/Worksite';
import { ReservationsService } from '../../service/reservations.service';
import { ReservationRequest } from '../../model/ReservationRequest';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/view/service/auth.service';
import { KeycloakProfile} from 'keycloak-js'
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DialogWindowComponent } from '../dialog-window/dialog-window.component';
import { RoomPlanComponent } from 'src/app/view/room/component/room-plan/room-plan.component';

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

export class AddReservationComponent implements OnInit{
    @ViewChild('planView') planView: RoomPlanComponent;

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
        private dialog: MatDialog
    ) {}


     dateRange = new FormGroup({
         start: new FormControl(),
         end: new FormControl()
     });

     availableRooms = true;
     selectableAvailableRooms = false;


    defualtFloor: number = 1;
    lastWorksite: Worksite = {coordinateX:-1, coordinateY: -1, roomId:0, worksiteId: 0,worksiteInRoomId: 0};

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

    tomorrow: Date;

    ngOnInit(): void {
        this.getUsers();
        this.getFloors();  
        let today = new Date();
        this.tomorrow = new Date(today);
        this.tomorrow.setDate(this.tomorrow.getDate() + 1);

    }

    getUsers(): void{
        this.usersService.getUsers().then(
            users => this.usersList = users
        );
        
    }

    reline(room: Room){
        this.planView.reline(room.dimensionX, room.dimensionY);
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
        this.planView.reline(0,0);
        if(floors !== undefined){
            if(start < end){
                await this.roomsService.getRooms(floors, start, end).then((rooms) => this.roomsList = rooms);
                this.worksitesList = [];
        }}else{
                this.roomsList = await this.roomsService.getRooms();
        }
    }

    async getWorksites(room?: Room, start?:Date, end?:Date){
        if(room !== undefined){
            console.log(room);
            this.reline(room);
            this.planView.setReservedAll();
            let positions: [[number, number]] = [[-1, -1]];
            positions.pop();
            await this.worksiteService.getWorksites(room.id, start, end).then((worksites) => {
                                                                        this.worksitesList = worksites;
                                                                        this.worksitesList.forEach(worksite => {
                                                                            if(this.reservatedWorkSites.length !== 0){
                                                                                this.reservatedWorkSites.forEach(reservation => {if(reservation.worksite.worksiteId !== worksite.worksiteId){
                                                                                    positions.push([worksite.coordinateX - 1, worksite.coordinateY - 1])}
                                                                                })
                                                                            }else{
                                                                                positions.push([worksite.coordinateX - 1, worksite.coordinateY - 1]);
                                                                            }
                                                                        });
                                                                        this.planView.setFree(positions);
                                                                        
            });
        }else{
            await this.worksiteService.getWorksites().then((worksites) => this.worksitesList = worksites);
        };
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

    openDialog(state: string, message: string){
        const dialogConfig =  new MatDialogConfig()

        dialogConfig.disableClose = true
        dialogConfig.autoFocus = true
        dialogConfig.data = {state:state, message:message}

        const dialogRef = this.dialog.open(DialogWindowComponent, dialogConfig);
    }

    getWorksiteFromPosition(position: [number, number]){
        for(let worksite of this.worksitesList){
            if(worksite.coordinateX - 1 === position[0] && worksite.coordinateY - 1 === position[1]){
                return worksite;
            }
        }
    }

    addChipToList(  
        owner?:	KeycloakProfile,
        floorNumber?: number,
        room?: Room,
        startDate?: Date,
        endDate?: Date
    ): void{
        let worksites = this.planView.getChosenWorkSites();
        if(worksites.length < 1){
            this.showToast('Nie zaznaczono żadnego miejsca', 'OK');
        } else{
            worksites.forEach((index) => {
                let worksite = this.getWorksiteFromPosition(index);
                if(owner === undefined || floorNumber === undefined || room === undefined || worksite === undefined || startDate === undefined || endDate === undefined){
                    this.showToast('Wszystkie pola muszą być wypełnione', 'OK');
                }
                else if(this.lastWorksite.worksiteId === worksite.worksiteId){
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
                            this.planView.setReserved([worksite.coordinateX - 1, worksite.coordinateY - 1]);
                            this.reservatedWorkSites.push({owner , floorNumber,  roomName: room.name , worksite, startDate:start, endDate:end});
                        }
                    }
            }});
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
            this.planView.setFree([[this.reservatedWorkSites[index].worksite.coordinateX - 1,
                                    this.reservatedWorkSites[index].worksite.coordinateY - 1]]);
            this.reservatedWorkSites.splice(index, 1);
            
        }
    }

    showToast(message: string, action: string): void{
        this._snackBar.open(message, action);
    }
}
