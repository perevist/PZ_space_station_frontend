import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ErrorStateMatcher, ShowOnDirtyErrorStateMatcher} from '@angular/material/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { DatePipe } from '@angular/common';
import { ReservationModule } from './reservation/reservation.module';
import { LoginModule } from './login/login.module';
import { RegistrationModule } from './registration/registration.module';
import { RoomModule } from './room/room.module';
import { initializer } from 'src/Appinit';
import { AuthService } from './service/auth.service';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    KeycloakAngularModule,
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,  
    LoginModule,
    RegistrationModule,
    ReservationModule,
    RoomModule
  ],
  providers: [
    KeycloakService,
    { 
        provide: APP_INITIALIZER, 
        useFactory: initializer,
        multi: true,
        deps: [KeycloakService]
    }, AuthService,

    {
        provide: ErrorStateMatcher,
        useClass: ShowOnDirtyErrorStateMatcher,
    },
    CookieService,
    DatePipe,

  ],
    
  bootstrap: [AppComponent]
})
export class AppModule { }
