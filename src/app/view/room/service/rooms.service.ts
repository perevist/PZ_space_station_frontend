import { DatePipe } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Message } from 'src/app/view/model/Message';
import { Room } from '../model/Room';
import { RoomRequestDto } from '../model/RoomRequestDto';

@Injectable({
  providedIn: 'root'
})
export class RoomsService {
  private GET_ROOMS = "http://localhost:8081/api/rooms/list";
  private POST_ROOMS = "http://localhost:8081/api/rooms";

  constructor(private http: HttpClient,
              private datepipe: DatePipe) { }

  getRooms(floor?: number, startDate?: Date, endDate?:Date): Promise<Room[]>{
    let enco: any = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    var startDateSearch = "startDate=";
    var endDateSearch = "endDate=";
    let start = this.datepipe.transform(startDate, 'yyyy-MM-dd');
    let end = this.datepipe.transform(endDate, 'yyyy-MM-dd');

    if(startDate && endDate){
      return this.http.get<Room[]>(
        this.GET_ROOMS
        + "?" + endDateSearch + end
        + "&" + startDateSearch + start, 
        {headers: enco, withCredentials: true}
      ).pipe(
          map(data => {
              return data.filter(d => d.floor === floor)
          })
      ).toPromise()
    }
    if(startDate && endDate){
      return this.http.get<Room[]>(
        this.GET_ROOMS
        + "?" + endDateSearch + end
        + "&" + startDateSearch + start, 
        {headers: enco, withCredentials: true}
      ).pipe(
        map(data => {
            return data.filter(d => d.floor === floor)
        })
    ).toPromise();
    }

    return this.http.get<Room[]>(this.GET_ROOMS, {headers: enco, withCredentials: true}).toPromise();
  }

  /** POST: add a new Room to the database */
  postRoom(roomRequest: RoomRequestDto): any {
    let enco: any = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post<RoomRequestDto>(this.POST_ROOMS, roomRequest, {headers: enco, withCredentials: true});
  }

  private handleError<T>(operation = 'operation') {
    return (error: any): Observable<Message> => {
      return of(new Message(error.message));
    };
  }
}
