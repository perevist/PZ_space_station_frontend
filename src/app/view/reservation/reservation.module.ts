import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule} from '@angular/material/chips';
import { MatSliderModule} from '@angular/material/slider';
import { MatTableModule } from '@angular/material/table'; 
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { ErrorStateMatcher, MatNativeDateModule, ShowOnDirtyErrorStateMatcher} from '@angular/material/core';
import { CookieService } from 'ngx-cookie-service';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from '../app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ReservationsTableComponent } from './component/reservations-table/reservations-table.component';
import { AddReservationComponent } from './component/add-reservation/add-reservation.component';
import { UsersChipsComponent } from './component/users-chips/users-chips.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { DialogWindowComponent } from './component/dialog-window/dialog-window.component';
import { RoomModule } from '../room/room.module';
import { EditReservationComponent } from './component/edit-reservation/edit-reservation.component';

@NgModule({
  declarations: [
    AddReservationComponent,
    ReservationsTableComponent,
    UsersChipsComponent,
    DialogWindowComponent,
    EditReservationComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    RouterModule.forRoot([
      { path: 'reservations-table', component: ReservationsTableComponent },
      { path: 'add-reservation', component: AddReservationComponent }
    ]),
    BrowserAnimationsModule,
    ReactiveFormsModule,
    RoomModule,

    // Material Components
    MatButtonModule,
    MatCardModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatChipsModule,
    MatSliderModule,
    MatNativeDateModule,
    MatTableModule,
    MatIconModule,
    MatSelectModule,
    MatDialogModule,
    MatSnackBarModule,
  ],
  providers: [
    { 
      provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher
    },
    CookieService,
    DatePipe
  ]
})

export class ReservationModule { }
