import { NgModule } from '@angular/core';
import { CommonModule} from '@angular/common';

import { LoginRoutingModule } from './login-routing.module';
import { LoginInputComponent } from './component/login-input/login-input.component';
import { LoginInfoComponent } from './component/login-info/login-info.component';
import { ErrorStateMatcher, ShowOnDirtyErrorStateMatcher } from '@angular/material/core';
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';


@NgModule({
  declarations: [
    LoginInputComponent,
    LoginInfoComponent,
  ],

  imports: [
    CommonModule,
    LoginRoutingModule,
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    RouterModule.forRoot([
      { path: 'login-input', component: LoginInputComponent },
    ])
  ],
  providers: [
    { 
      provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher
    },
    CookieService
  ]
})
export class LoginModule { }
