import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddRoomComponent } from './component/add-room/add-room.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [AddRoomComponent],
  imports: [
    CommonModule,

    RouterModule.forRoot([
      { path: 'reservations-table', component: ReservationsTableComponent },
      { path: 'add-reservation', component: AddReservationComponent }
    ]),

  ]
})
export class RoomModule { }
