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

  constructor(private http: HttpClient) { }

  getUsers(): Observable<Worksite[]>{
    let enco: any = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.get<Worksite[]>(this.GET_WORKSITES, {headers: enco, withCredentials: true});
  }

  private handleError<T>(operation = 'operation'){
    return (error: any): Observable<Message> => {
      return of(new Message(error.message));
    }
  }
}
