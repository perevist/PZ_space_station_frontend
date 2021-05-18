import { Coordinates } from './Coordinates';

export interface WorksiteResponseDto {
  coordinates: Coordinates;
  worksiteId: number;
  roomId: number;
  worksiteInRoomId: number;
}
