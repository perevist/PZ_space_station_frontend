import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataflowService {

    private reservationToModify = new BehaviorSubject({});
    currentReservation = this.reservationToModify.asObservable();

    constructor() { }

    changeReservation(reservation: any){
        this.reservationToModify.next(reservation);
    }
}
