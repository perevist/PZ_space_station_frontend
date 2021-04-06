import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AddReservationComponent } from './add-reservation/add-reservation.component';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule} from '@angular/material/chips';
import { MatSliderModule} from '@angular/material/slider';
import { ErrorStateMatcher, MatNativeDateModule, ShowOnDirtyErrorStateMatcher} from '@angular/material/core';
import { ReservationsTableComponent } from './reservations-table/reservations-table.component';
import { MatTableModule } from '@angular/material/table'; 
import { LoginInputComponent } from './login-input/login-input.component';
import { MatIconModule } from '@angular/material/icon';
import { RegistrationComponent } from './registration/registration.component';
import { UsersChipsComponent } from './users-chips/users-chips.component';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { LoginInfoComponent } from './login-info/login-info.component';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  declarations: [
    AppComponent,
    AddReservationComponent,
    ReservationsTableComponent,
    LoginInputComponent,
    RegistrationComponent,
    UsersChipsComponent,
    LoginInfoComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    RouterModule.forRoot([
      { path: 'reservations-table', component: ReservationsTableComponent },
      { path: 'add-reservation', component: AddReservationComponent },
      { path: 'login-input', component: LoginInputComponent },
      { path: 'registration', component: RegistrationComponent }
    ]),
    BrowserAnimationsModule,
    ReactiveFormsModule,

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
    MatDialogModule


  ],
  providers: [
    { 
      provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher
    },
    CookieService
  ],
    
  bootstrap: [AppComponent]
})
export class AppModule { }
