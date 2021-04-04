import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
// import { CookieService } from 'ngx-cookie-service';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Message } from '../model/Message';
import { RegistrationRequest } from '../model/RegistrationRequest';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {
  private readonly POST_REGISTRATION = 'http://localhost:8080/registration';

  constructor(private http: HttpClient) { }

  /** POST: add a new User to the database */
  registerUser(registrationRequest: RegistrationRequest): any {
    return this.http.post<Message>(this.POST_REGISTRATION, registrationRequest);
  }

  private handleError<T>(operation = 'operation') {
    return (error: any): Observable<Message> => {
      return of(new Message(error.message));
    };
  }
}

