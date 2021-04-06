import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Message } from '../model/Message';
import { Room } from '../model/Room';

@Injectable({
  providedIn: 'root'
})
export class RoomsService {
  private GET_ROOMS = "http://localhost:8080/api/rooms/list";

  constructor(private http: HttpClient) { }

  getRooms(floor?: string, startDate?: string, endDate?:string): Observable<Room[]>{
    let enco: any = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    var startDateSearch = "";
    var endDateSearch = "";
    var floorSearch = "";
    if(startDate && endDate){
      startDateSearch = "&startDate=";
      endDateSearch = "?endDate=";
    } else{
      floorSearch = "?floor=";
    }
    if (floor && endDate && startDate){
      floorSearch = "&floor=";
    }


    return this.http.get<Room[]>(this.GET_ROOMS, {headers: enco, withCredentials: true});
  }

  private handleError<T>(operation = 'operation') {
    return (error: any): Observable<Message> => {
      return of(new Message(error.message));
    };
  }
}
