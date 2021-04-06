export interface Reservation{
  id: number;
  reservationMakerId: number;
  reservationMakerFirstName: string;
  reservationMakerLastName:	string;
  ownerId: number;
  ownerFirstName: string;
  ownerLastName: string;
  worksiteId: number;
  roomId: number;
  worksiteInRoomId: number;
  startDate: string;
  endDate: string;
}
