import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Message } from '../model/Message';
import { UserResponseDto } from '../model/UserResponseDto';



@Injectable({
  providedIn: 'root'
})
export class UsersService {
  readonly GET_USERS = 'http://localhost:8081/api/users/list';

  constructor(private http: HttpClient) { }

  getUsers(): Observable<UserResponseDto[]>{
    let enco: any = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.get<UserResponseDto[]>(this.GET_USERS, {headers: enco, withCredentials: true});
  }

  private handleError<T>(operation = 'operation'){
    return (error: any): Observable<Message> => {
      return of(new Message(error.message));
    }
  }
}
