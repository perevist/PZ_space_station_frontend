import { DatePipe } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Message } from '../model/Message';
import { Worksite } from '../model/Worksite';

@Injectable({
  providedIn: 'root'
})
export class WorksitesService {
  readonly GET_WORKSITES = 'http://localhost:8081/api/worksites/list';

  constructor(private http: HttpClient,
              private datepipe: DatePipe) { }

  getWorksites(room?: number, startDate?: Date, endDate?:Date): Promise<Worksite[]>{

    var startDateSearch = "";
    var endDateSearch = "";
    var floorSearch = "";
    var roomId = "";
    if (room !== undefined){
        roomId = room.toString();
    }
    if(startDate && !roomId && !endDate){
      startDateSearch = "?startDate=";
      let start = this.datepipe.transform(startDate, 'yyyy-MM-dd');
      return this.http.get<Worksite[]>(this.GET_WORKSITES+startDateSearch+start).toPromise();
    }
    if(startDate && endDate && !roomId){
      endDateSearch = "?endDate=";
      startDateSearch = "&startDate=";
      let start = this.datepipe.transform(startDate, 'yyyy-MM-dd');
      let end = this.datepipe.transform(endDate, 'yyyy-MM-dd');
      return this.http.get<Worksite[]>(this.GET_WORKSITES+endDateSearch+end+startDateSearch+start).toPromise();
    }
    if(roomId && !startDate){
      floorSearch = "?roomId=";
      return this.http.get<Worksite[]>(this.GET_WORKSITES+floorSearch+roomId).toPromise();
    }
    if(roomId && startDate && !endDate){
      floorSearch = "?roomId=";
      startDateSearch = "&startDate=";
      let start = this.datepipe.transform(startDate, 'yyyy-MM-dd');
      return this.http.get<Worksite[]>(this.GET_WORKSITES+floorSearch+roomId+startDateSearch+start).toPromise();
    }
    if(roomId && startDate && endDate){
      floorSearch = "&roomId=";
      startDateSearch = "&startDate=";
      endDateSearch = "?endDate=";
      let start = this.datepipe.transform(startDate, 'yyyy-MM-dd');
      let end = this.datepipe.transform(endDate, 'yyyy-MM-dd');
      return this.http.get<Worksite[]>(this.GET_WORKSITES+endDateSearch+end+floorSearch+roomId+startDateSearch+start).toPromise();
    }
    return this.http.get<Worksite[]>(this.GET_WORKSITES).toPromise();
  }

  private handleError<T>(operation = 'operation'){
    return (error: any): Observable<Message> => {
      return of(new Message(error.message));
    }
  }
}
