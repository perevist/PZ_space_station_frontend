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
  readonly GET_WORKSITES = 'http://localhost:8080/api/worksites/list';

  constructor(private http: HttpClient,
              private datepipe: DatePipe) { }

  getWorksites(roomId?: string, startDate?: Date, endDate?:Date): Observable<Worksite[]>{
    let enco: any = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    var startDateSearch = "";
    var endDateSearch = "";
    var floorSearch = "";
    let start = this.datepipe.transform(startDate, 'yyyy-MM-dd');
    let end = this.datepipe.transform(endDate, 'yyyy-MM-dd');
    if(startDate && !roomId && !endDate){
      startDateSearch = "?startDate=";
      let start = this.datepipe.transform(startDate, 'yyyy-MM-dd');
      return this.http.get<Worksite[]>(this.GET_WORKSITES+startDateSearch+start, {headers: enco, withCredentials: true});
    }
    if(startDate && endDate && !roomId){
      endDateSearch = "?endDate=";
      startDateSearch = "&startDate=";
      let start = this.datepipe.transform(startDate, 'yyyy-MM-dd');
      let end = this.datepipe.transform(endDate, 'yyyy-MM-dd');
      return this.http.get<Worksite[]>(this.GET_WORKSITES+endDateSearch+end+startDateSearch+start, {headers: enco, withCredentials: true});
    }
    if(roomId && !startDate){
      floorSearch = "?roomId=";
      return this.http.get<Worksite[]>(this.GET_WORKSITES+floorSearch+roomId, {headers: enco, withCredentials: true});
    }
    if(roomId && startDate && !endDate){
      floorSearch = "?roomId=";
      startDateSearch = "&startDate=";
      let start = this.datepipe.transform(startDate, 'yyyy-MM-dd');
      return this.http.get<Worksite[]>(this.GET_WORKSITES+floorSearch+roomId+startDateSearch+start, {headers: enco, withCredentials: true});
    }
    if(roomId && startDate && endDate){
      floorSearch = "&roomId=";
      startDateSearch = "&startDate=";
      endDateSearch = "?endDate=";
      let start = this.datepipe.transform(startDate, 'yyyy-MM-dd');
      let end = this.datepipe.transform(endDate, 'yyyy-MM-dd');
      return this.http.get<Worksite[]>(this.GET_WORKSITES+endDateSearch+end+floorSearch+roomId+startDateSearch+start, {headers: enco, withCredentials: true});
    }



    return this.http.get<Worksite[]>(this.GET_WORKSITES, {headers: enco, withCredentials: true});
  }

  private handleError<T>(operation = 'operation'){
    return (error: any): Observable<Message> => {
      return of(new Message(error.message));
    }
  }
}
