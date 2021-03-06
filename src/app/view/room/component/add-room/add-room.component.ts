import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/view/service/auth.service';
import { FloorsService } from 'src/app/view/service/floors.service';
import { RoomRequestDto } from '../../model/RoomRequestDto';
import { RoomsService } from '../../service/rooms.service';
import { RoomPlanComponent } from '../room-plan/room-plan.component';

@Component({
  selector: 'app-add-room',
  templateUrl: './add-room.component.html',
  styleUrls: ['./add-room.component.css'],
})
export class AddRoomComponent implements OnInit {
  @ViewChild('planView') planView: RoomPlanComponent;

  floors: number[] = [];
  newRoom: RoomRequestDto;

  // TODO Add validators of new room fields in formm
  newRoomFormGroup: FormGroup = new FormGroup({
    name: new FormControl('', Validators.required),
  });

  planFormGroup: FormGroup = new FormGroup({
    numberOfRows: new FormControl('0', Validators.required),
    numberOfColumns: new FormControl('0', Validators.required),
  });

  constructor(
    protected router: Router,
    protected keycloakService: AuthService,
    private floorsService: FloorsService,
    private roomsService: RoomsService,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.getFloors();
  }

  reline(columns: number, rows: number): void {
    if (this.planFormGroup.valid) {
      this.planView.reline(columns, rows);
    }
  }

  getFloors(): void {
    this.floorsService.getFloors().subscribe((numberOfFloors) => {
      for (var i = 1; i <= numberOfFloors.numberOfFloors; i++) {
        this.floors[i] = i;
      }
    });
  }

  postRoom(
    floorNumber: number,
    roomName: string,
    dimensionX: number,
    dimensionY: number
  ): void {
    if (this.newRoomFormGroup.valid && this.planFormGroup.valid && this.planView.getWorkSitesListSize()) {
      let worksites = this.planView.getWorkSites();
      this.newRoom = {
        dimensionX: dimensionX,
        dimensionY: dimensionY,
        floor: floorNumber,
        name: roomName,
        numberOfWorksites: worksites.length,
        worksites: worksites
      };
      console.log(this.newRoom);
      this.roomsService.postRoom(this.newRoom).subscribe(
        (msg) => {
          console.log(msg);
          this.showToast('Uda??o si?? utworzy?? nowy pok??j', 'OK');
        },
        (error) => {
          console.log(error.message);
          this.showToast('Utworzenie pokoju nie powiod??o si??', 'OK');
        }
      );
      this.newRoomFormGroup.reset({
        name: '',
        workSiteNumber: '',
      });
    } else {
      this.showToast('Niepoprawne wype??nienie pola', 'OK');
    }
  }

  showToast(message: string, action: string): void {
    this._snackBar.open(message, action, {
      duration: 3000,
    });
  }
}
