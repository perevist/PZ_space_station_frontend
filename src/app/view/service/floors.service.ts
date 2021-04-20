import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Floors } from '../model/Floors';
import { Message } from '../model/Message';


@Injectable({
  providedIn: 'root'
})
export class FloorsService {

  private GET_FLOORS = "http://localhost:8080/api/floors";

  constructor(private http: HttpClient) { }

  getFloors(): Observable<Floors>{
    let enco: any = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.get<Floors>(this.GET_FLOORS, {headers: enco, withCredentials: true});
  }

  private handleError<T>(operation = 'operation') {
    return (error: any): Observable<Message> => {
      return of(new Message(error.message));
    };
  }
}
