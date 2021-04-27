import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Message } from '../model/Message';
import { KeycloakProfile } from 'keycloak-js'
import { UserResponseDto } from '../model/UserResponseDto';



@Injectable({
  providedIn: 'root'
})
export class UsersService {
  //readonly GET_USERS = 'http://localhost:8081/api/users/list';
    readonly GET_USERS = 'http://localhost:8080/auth/admin/realms/SpaceStation/users';
  constructor(private http: HttpClient) { }

  getUsers(): Observable<KeycloakProfile[]>{

    return this.http.get<KeycloakProfile[]>(this.GET_USERS);
  }

  private handleError<T>(operation = 'operation'){
    return (error: any): Observable<Message> => {
      return of(new Message(error.message));
    }
  }
}
