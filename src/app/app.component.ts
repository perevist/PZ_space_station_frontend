import { TranslationWidth } from '@angular/common';
import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { KeycloakProfile, KeycloakTokenParsed } from 'keycloak-js';
import { connectableObservableDescriptor } from 'rxjs/internal/observable/ConnectableObservable';
import { AuthService } from './service/auth.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'SpaceStation-frontend';

  public isLoggedIn = false;
  userProfile : KeycloakTokenParsed;
  constructor(private readonly keycloak: AuthService){}
  //  constructor() {}

  public async ngOnInit(){
        let user = this.keycloak.getLoggedUser();
        this.userProfile = user;
       if (this.userProfile != undefined){
           this.isLoggedIn = true;
        }
  }

  public login(){
      
      this.keycloak.login();
  }

  public register(){
      this.keycloak.register();
  }

  public logout(){
      this.keycloak.logout();
      this.isLoggedIn = false;
  }


}
