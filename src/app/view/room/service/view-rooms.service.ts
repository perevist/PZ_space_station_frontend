import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Message } from '../../model/Message';
import { Room } from '../model/Room';

@Injectable({
  providedIn: 'root'
})
export class ViewRoomsService {

  private GET_ROOMS = "http://localhost:8081/api/rooms/list";

  constructor(
    private http: HttpClient
  ) { }

  getRooms(floor?: number): Promise<Room[]>{
    let enco: any = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    if(floor){
      return this.http.get<Room[]>(
        this.GET_ROOMS
        + "?floor=" + floor.toString(), 
        {headers: enco, withCredentials: true}
      ).toPromise();
    }
    else {
      return this.http.get<Room[]>(
        this.GET_ROOMS, 
        {headers: enco, withCredentials: true}
      ).toPromise();
    }
  }

  private handleError<T>(operation = 'operation') {
    return (error: any): Observable<Message> => {
      return of(new Message(error.message));
    };
  }
}
