import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
  public isAdmin = false;
  userProfile : KeycloakTokenParsed;
  constructor(private readonly keycloak: AuthService, public router: Router){
    
  }

  public async ngOnInit(){
    this.setLogin();
  }

  public login(){
    this.keycloak.login();
    this.setLogin();
  }

  public register(){
    this.keycloak.register();
  }

  public logout(){
    this.keycloak.logout();
    if(this.keycloak.getLoggedUser() == undefined){
      this.isLoggedIn = false;
      this.isAdmin = false;
    } 
  }

  private setLogin(){
    this.userProfile = this.keycloak.getLoggedUser();
    if (this.userProfile != undefined){
      this.isLoggedIn = true;
      if(this.keycloak.getRoles().includes('admin')){
        this.isAdmin = true;
      }
    }
  }

}
