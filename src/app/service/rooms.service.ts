import { DatePipe } from '@angular/common';
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

  constructor(private http: HttpClient,
              private datepipe: DatePipe) { }

  getRooms(floor?: string, startDate?: Date, endDate?:Date): Observable<Room[]>{
    let enco: any = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    var startDateSearch = "startDate=";
    var endDateSearch = "endDate=";
    var floorSearch = "floor=";
    let start = this.datepipe.transform(startDate, 'yyyy-MM-dd');
    let end = this.datepipe.transform(endDate, 'yyyy-MM-dd');

  /*  if(startDate && !floor && !endDate){
      return this.http.get<Room[]>(
        this.GET_ROOMS 
        + "?" + startDateSearch + start, 
        {headers: enco, withCredentials: true}
      );
    }*/
    if(startDate && endDate && !floor){
      return this.http.get<Room[]>(
        this.GET_ROOMS
        + "?" + endDateSearch + end
        + "&" + startDateSearch + start, 
        {headers: enco, withCredentials: true}
      );
    }
    if(floor && !startDate){
      return this.http.get<Room[]>(
        this.GET_ROOMS
        + "?" + floorSearch + floor, 
        {headers: enco, withCredentials: true}
      );
    }
 /*   if(floor && startDate && !endDate){
      return this.http.get<Room[]>(
        this.GET_ROOMS 
        + "?" + floorSearch + floor
        + "&" + startDateSearch + start, 
        {headers: enco, withCredentials: true}
      );
    }*/
    if(floor && startDate && endDate){
      return this.http.get<Room[]>(
        this.GET_ROOMS
        + "?" + endDateSearch + end
        + "&" + floorSearch + floor 
        + "&" + startDateSearch + start, 
        {headers: enco, withCredentials: true}
      );
    }

    return this.http.get<Room[]>(this.GET_ROOMS, {headers: enco, withCredentials: true});
  }

  private handleError<T>(operation = 'operation') {
    return (error: any): Observable<Message> => {
      return of(new Message(error.message));
    };
  }
}
