import {HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { LoginRequest } from '../model/LoginRequest';
import { Message } from 'src/app/model/Message';
import { catchError, map, tap } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private LOGIN_URL = 'http://localhost:8080/login';

  constructor(private http: HttpClient, private cookieService: CookieService) {
  }

  loginUser(loginRequest: LoginRequest): any {
    let enco: any = new HttpHeaders()
      .set('Content-Type', 'application/x-www-form-urlencoded');
    return this.http.post<Message>(this.LOGIN_URL, loginRequest, {headers: enco, withCredentials: true});
  }

  private handleError<T>(operation = 'operation') {
    return (error: any): Observable<Message> => {
      return of(new Message(error.message));
    };
  }
}
