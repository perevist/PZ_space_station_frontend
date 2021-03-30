import { Component, OnInit } from '@angular/core';



@Component({
  templateUrl: './add-reservation.component.html',
  styleUrls: ['./add-reservation.component.css']
})
export class AddReservationComponent implements OnInit {

  rooms: number[] = [1, 2, 3, 4, 5]; //TODO Zmienić przykład na interface z bazy danych
  workSitesIds: number[] = [1, 2, 3, 4, 5] //TODO Zmienić przykład na interface z bazy danych
  constructor() { }
  
  ngOnInit(): void {
    
  }

}
