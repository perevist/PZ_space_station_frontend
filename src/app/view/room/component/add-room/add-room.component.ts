import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/view/service/auth.service';
import { FloorsService } from 'src/app/view/service/floors.service';
import { Room } from '../../model/Room';
import { RoomRequest } from '../../model/RoomRequest';
import { RoomsService } from '../../service/rooms.service';

@Component({
  selector: 'app-add-room',
  templateUrl: './add-room.component.html',
  styleUrls: ['./add-room.component.css']
})
export class AddRoomComponent implements OnInit {

  floors: number[] = [];
  newRoom: RoomRequest;

  // TODO Add validators of new room fields in formm
  newRoomFormGroup: FormGroup = new FormGroup({
    // floor: new FormControl(),
    name: new FormControl('', Validators.required),
    numberOfWorksites: new FormControl('', Validators.required)
  })

  constructor(
    protected router: Router, 
    protected keycloakService: AuthService,
    private floorsService: FloorsService,
    private roomsService: RoomsService,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void { 
    this.getFloors();
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

  postRoom(
    floorNumber: number,
    roomName: string,
    workSiteNumber: number
  ): void{
    if( this.newRoomFormGroup.valid ){
      this.newRoom = {floor: floorNumber, name: roomName, numberOfWorksites: workSiteNumber}
      this.roomsService.postRoom( this.newRoom )
        .subscribe(msg => {
          console.log(msg); 
          this.showToast('Udało się utworzyć nowy pokój', 'OK');
        }, error => {
          console.log(error.message);
          this.showToast('Utworzenie pokoju nie powiodło się', 'OK');
        });
        this.newRoomFormGroup.reset({
          name : '',
          workSiteNumber : ''
        });
    }
    else {
      this.showToast('Niepoprawne wypełnienie pola', 'OK');
    }
  }

  showToast(message: string, action: string): void{
    this._snackBar.open(message, action);
  }

}
