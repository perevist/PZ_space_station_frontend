import { Component, OnInit } from '@angular/core';
import { KeycloakTokenParsed } from 'keycloak-js';
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

  public async ngOnInit(){
        let user = this.keycloak.getLoggedUser();
        this.userProfile = user;
       if (this.userProfile != undefined){
           this.isLoggedIn = true;
        }
  }

  public login(){
      this.keycloak.login();
      let user = this.keycloak.getLoggedUser();
      this.userProfile = user;
     if (this.userProfile != undefined){
         this.isLoggedIn = true;
      }
  }

  public register(){
      this.keycloak.register();
  }

  public logout(){
        this.keycloak.logout();
        if(this.keycloak.getLoggedUser() == undefined){
            this.isLoggedIn = false;
        } 

  }


}
