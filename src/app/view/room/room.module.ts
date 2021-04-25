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
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSliderModule } from '@angular/material/slider';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from '../app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { RoomRoutingModule } from './room-routing.module';



@NgModule({
  declarations: [AddRoomComponent, ViewRoomComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    CommonModule,
    RoomRoutingModule,

    // RouterModule.forRoot([
    //   { path: 'room/add-room', component: AddRoomComponent },
    //   { path: 'view-room', component: ViewRoomComponent }
    // ]),

    RouterModule.forRoot([
      { 
        path: 'room',
        children: [
          { path: 'add', component: AddRoomComponent },
          { path: 'view', component: ViewRoomComponent }
        ]
      }
    ]),

    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule,
    MatTableModule,
    MatSliderModule,
    MatDialogModule,
    MatSnackBarModule
  ]
})
export class RoomModule { }
