import { Injectable } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';

@Injectable({
  providedIn: 'root'
})
export class AuthService{
  
  constructor(private keycloakService: KeycloakService) { }

  getLoggedUser(){
      try {
          let userDetails = this.keycloakService.getKeycloakInstance().idTokenParsed;
          return userDetails;
      } catch(e){
          console.log('getLoggedUser Exception', e);
          return undefined;
      }
  }

  login(){
      this.keycloakService.login();
  }

  logout() {
      this.keycloakService.logout();
  }

  redirectToProfile() {
      this.keycloakService.getKeycloakInstance().accountManagement();
  }

  getRoles(): string[]{
      return this.keycloakService.getUserRoles();
  }

  
  getToken(): string{
      return this.keycloakService.getKeycloakInstance().token;
  }

  register(){
      this.keycloakService.register();
  }
}
