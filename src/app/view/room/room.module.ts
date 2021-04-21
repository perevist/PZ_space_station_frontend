import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddRoomComponent } from './component/add-room/add-room.component';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { ViewRoomComponent } from './component/view-room/view-room.component';
import { MatTableModule } from '@angular/material/table';



@NgModule({
  declarations: [AddRoomComponent, ViewRoomComponent],
  imports: [
    CommonModule,

    RouterModule.forRoot([
      { path: 'add-room', component: AddRoomComponent },
      { path: 'view-room', component: ViewRoomComponent }
    ]),

    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule,
    MatTableModule

  ]
})
export class RoomModule { }
