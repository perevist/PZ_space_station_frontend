import { Component, OnInit } from '@angular/core';
import { Reservation } from 'src/app/reservations';
import { ReservationsService } from 'src/app/reservations.service';

@Component({
  selector: 'app-reservations',
  templateUrl: './reservations.component.html',
  styleUrls: ['./reservations.component.css']
})
export class ReservationsComponent implements OnInit {
  reservations: Reservation[];

  constructor(private reservationsService: ReservationsService) { }

  ngOnInit() {
    this.getReservations();
  }

  getReservations(){
    this.reservationsService.getReservations().subscribe(
      reservations => this.reservations = reservations
    );
  }

}
