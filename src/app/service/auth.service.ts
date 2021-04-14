import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { KeycloakAuthGuard, KeycloakService } from 'keycloak-angular';

@Injectable({
  providedIn: 'root'
})
export class AuthService{
  
  constructor(private keycloakService: KeycloakService) { }

  getLoggedUser(){
      try {
          let userDetails = this.keycloakService.getKeycloakInstance().idTokenParsed;
          console.log('UserDetails', userDetails);
          console.log('UserRoles', this.keycloakService.getUserRoles());
          return userDetails;
      } catch(e){
          console.log('getLoggedUser Exception', e);
          return undefined;
      }
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
}
