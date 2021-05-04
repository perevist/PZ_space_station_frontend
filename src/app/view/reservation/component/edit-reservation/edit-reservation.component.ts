import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { KeycloakProfile } from 'keycloak-js';
import { Subscription } from 'rxjs';
import { Worksite } from 'src/app/view/model/Worksite';
import { RoomPlanComponent } from 'src/app/view/room/component/room-plan/room-plan.component';
import { Room } from 'src/app/view/room/model/Room';
import { RoomsService } from 'src/app/view/room/service/rooms.service';
import { AuthService } from 'src/app/view/service/auth.service';
import { FloorsService } from 'src/app/view/service/floors.service';
import { UsersService } from 'src/app/view/service/users.service';
import { WorksitesService } from 'src/app/view/service/worksites.service';
import { ReservationRequest } from '../../model/ReservationRequest';
import { DataflowService } from '../../service/dataflow.service';
import { ReservationsService } from '../../service/reservations.service';
import { DialogWindowComponent } from '../dialog-window/dialog-window.component';

@Component({
  selector: 'app-edit-reservation',
  templateUrl: './edit-reservation.component.html',
  styleUrls: ['./edit-reservation.component.css']
})
export class EditReservationComponent implements OnInit {
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
    private dataService: DataflowService,
    private dialog: MatDialog) { }


    
    dateRange = new FormGroup({
        start: new FormControl(),
        end: new FormControl()
    });


    subscription: Subscription;
    availableRooms = true;
    selectableAvailableRooms = false;

    reservationToModify: any = {};
    preparedReservationToInput: any = {};

    lastWorksite: Worksite = {coordinateX:-1, coordinateY: -1, roomId:0, worksiteId: 0,worksiteInRoomId: 0};

    userFromEditedReservation: KeycloakProfile;
    worskstieFromEditedReservation: Worksite = {coordinateX:-1, coordinateY: -1, roomId:0, worksiteId: 0,worksiteInRoomId: 0};
    roomFromEditedReservation: Room = {dimensionX: -1, dimensionY: -1, floor: 0, id: -1, name: '', numberOfWorksites: 0};

    user: any;
    usersList: KeycloakProfile[] = [];
    floors: number[] = [];
    roomsList: Room[] = [];
    worksitesList: Worksite[] = [];
    reservation: ReservationRequest;

    ngOnInit(): void {
        this.getWorksites();
        this.getFloors();
        this.getRooms();
        this.getUsers();
        setTimeout(() =>{
        this.subscription = this.dataService.currentReservation.subscribe(reservation => this.reservationToModify = reservation);
        this.prepareDataToInput();
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
        this.getWorksites(this.roomFromEditedReservation, this.reservationToModify.startDate, this.reservationToModify.endDate);
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
            this.reline(this.roomFromEditedReservation);
            this.planView.setReservedAll();
            let positions: [[number, number]] = [[-1, -1]];
            positions.pop();
            this.worksitesList.forEach(worksite => {positions.push([worksite.coordinateX - 1, worksite.coordinateY - 1])});
            console.log(positions);
            console.log(this.worksitesList);
            console.log(this.worskstieFromEditedReservation);
            this.planView.setFree(positions);
            
            this.planView.setChosen([this.worskstieFromEditedReservation.coordinateX-1, this.worskstieFromEditedReservation.coordinateY-1]);

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

    async getRooms(floor?: number, start?:Date, end?:Date){
        if(floor !== undefined){
            if(start < end){
                await this.roomsService.getRooms(floor, start, end).then((rooms) => this.roomsList = rooms);
                this.getWorksites(this.roomFromEditedReservation, start, end);
                //this.worksitesList = [];
        }}else{
                this.roomsList = await this.roomsService.getRooms();
        }
        if(this.preparedReservationToInput.floor !== undefined && floor === this.roomFromEditedReservation.floor ){
            let i = 0;
            for(let r of this.roomsList){
                if (r.id === this.roomFromEditedReservation.id){
                    this.roomsList[i] = this.roomFromEditedReservation;
                    break;
                }
                i++;
                if(i === this.roomsList.length){
                    this.roomsList.push(this.roomFromEditedReservation);
                    this.sortRoomList();
                }
            }
        }
    }

    reline(room: Room){
        this.planView.reline(room.dimensionX, room.dimensionY);
    }

    async getWorksites(room?: Room, start?:Date, end?:Date){
        this.reline(room);
        if(room !== undefined){
            await this.worksiteService.getWorksites(room.id, start, end).then((worksites) => {
                                                                        this.worksitesList = worksites;                  
            });
        }else{
            await this.worksiteService.getWorksites().then((worksites) => this.worksitesList = worksites);
        };
        if(this.preparedReservationToInput.worksite !== undefined && this.worksitesList.indexOf(this.worskstieFromEditedReservation) === -1
          && this.worskstieFromEditedReservation.roomId === room.id){
            if (this.worksitesList.length === 0){
                this.worksitesList.push(this.worskstieFromEditedReservation);
            }else{
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
    }

    getWorksiteFromPosition(position: [number, number]){
        for(let worksite of this.worksitesList){
            if(worksite.coordinateX - 1 === position[0] && worksite.coordinateY - 1 === position[1]){
                return worksite;
            }
        }
    }

    
    putReservation(
        owner: KeycloakProfile,
        startDate: Date,
        endDate: Date){
            let date = new Date();
            let start = new Date(this.reservationToModify.startDate).getDate();
            let end = new Date(this.reservationToModify.endDate).getDate();
            let worksitePosition = this.planView.getChosenWorkSites();
            let worksite = this.getWorksiteFromPosition(worksitePosition[0]);

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

    showToast(message: string, action: string): void{
        this._snackBar.open(message, action);
    }

}
