import { DataSource } from '@angular/cdk/collections';
import { Observable, of as observableOf } from 'rxjs';
import { Injectable } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { Room } from '../../model/Room';
import { ViewRoomsService } from '../../service/view-rooms.service';

@Injectable({
    providedIn: 'root',
})

export class RoomDataSource extends DataSource<Room> {
  roomsList: Room[] = [];

  constructor(
		private roomsService: ViewRoomsService
	) {
    super();
  }

	async getRooms(
		floors?: number
	): Promise<Room[]>{
		this.roomsList = await this.roomsService.getRooms(floors);
		console.log(this.roomsList);
		return this.roomsList;
	}

  connect(): Observable<Room[]> {
    return observableOf(this.roomsList);
  }

  disconnect(): void {}
}
