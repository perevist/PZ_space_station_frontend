export interface ReservationResponse{
  id: number;
  reservationMakerId: number;
  reservationMakerFirstName: string;
  reservationMakerLastName:	string;
  ownerId: string;
  ownerFirstName: string;
  ownerLastName: string;
  worksiteId: number;
  roomId: number;
  worksiteInRoomId: number;
  startDate: string;
  endDate: string;
}
