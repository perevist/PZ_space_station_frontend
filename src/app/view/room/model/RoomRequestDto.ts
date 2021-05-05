import { WorksiteRequestDto } from "../../model/WorksiteRequestDto";

export interface RoomRequestDto{
    dimensionX: number;
    dimensionY: number;
    floor: number;
    name: string;
    numberOfWorksites: number;
    worksites:	Array<WorksiteRequestDto>;
}