import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { UserRegistrationData } from './user-registration-data';
import { User } from './user';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {
  readonly POST_USER = 'http://localhost:8080/api/reservations/';

  constructor(private http: HttpClient) { }

  /** POST: add a new User to the database */
  registerUser(user: UserRegistrationData): Observable<User> {
  return this.http.post<User>(this.POST_USER, user, httpOptions)
    .pipe(
      // catchError(this.handleError('registerUser', user)) TODO
    );
}

private handleError(error: HttpErrorResponse, user: Observable<User>) {
  if (error.error instanceof ErrorEvent) {
    // A client-side or network error occurred. Handle it accordingly.
    console.error('An error occurred:', error.error.message);
  } else {
    // The backend returned an unsuccessful response code.
    // The response body may contain clues as to what went wrong.
    console.error(
      `Backend returned code ${error.status}, ` +
      `body was: ${error.error}`);
  }
  // Return an observable with a user-facing error message.
  return throwError(
    'Something bad happened; please try again later.');
}
}

