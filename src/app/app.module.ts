import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './view/app-routing.module';
import { AppComponent } from './view/app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ErrorStateMatcher, ShowOnDirtyErrorStateMatcher} from '@angular/material/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { DatePipe } from '@angular/common';
import { ReservationModule } from './view/reservation/reservation.module';
import { LoginModule } from './view/login/login.module';
import { RegistrationModule } from './view/registration/registration.module';
import { RoomModule } from './view/room/room.module';
import { initializer } from 'src/app/utility/app.init';
import { AuthService } from './view/service/auth.service';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { RoomPlanComponent } from './view/room/component/room-plan/room-plan.component';
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

    LoginModule,
    RegistrationModule,
    ReservationModule,
    RoomModule,

    MatIconModule,
    MatToolbarModule,
    MatMenuModule
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
