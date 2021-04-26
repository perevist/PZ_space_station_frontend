import { Component, ChangeDetectionStrategy, ViewChild, AfterViewInit, ElementRef } from '@angular/core';


enum WorkSiteField{
  RESERVED,
  FREE,
  LACK
}

@Component({
  selector: 'app-room-plan',
  templateUrl: './room-plan.component.html',
  styleUrls: ['./room-plan.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RoomPlanComponent implements AfterViewInit{

  @ViewChild('canvasRoomPlan') canvasRoomPlan: ElementRef;
  
  /** Canvas 2d context */
  private context: CanvasRenderingContext2D;
  private workSitePosition: WorkSiteField[][];

  private cellHeight: number;
  private cellWidth: number;
  private columns: number;
  private rows: number;
  private readonly font: string = "Arial";

  constructor() {}

  ngAfterViewInit() {
    const canvas = this.canvasRoomPlan.nativeElement as HTMLCanvasElement;    

    this.context = canvas.getContext('2d');

    this.reline(10, 5);

    this.createUserEvents();
  }

  public reline(columns: number, rows: number): void {
    const canvas = this.canvasRoomPlan.nativeElement as HTMLCanvasElement;

    this.columns = columns;
    this.rows = rows;

    const workSitePosition = new Array(rows)
      .fill(undefined)
      .map(() => new Array(columns)
        .fill(WorkSiteField.FREE));

    this.cellHeight = canvas.height / rows;
    this.cellWidth = canvas.width / columns;

    this.workSitePosition = workSitePosition;

    this.redraw();
  }

  public getWorkSites(): [number, number]{
    const rows = this.rows;
    const columns = this.columns;
    const workSitePosition = this.workSitePosition;

    let worksites: [number, number];

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < columns; col++) {
        if(workSitePosition[row][col] !== WorkSiteField.LACK){
          worksites.push(row, col);
        }
      }
    }

    return worksites;
  }

  private createUserEvents() {
    const canvas = this.canvasRoomPlan.nativeElement as HTMLCanvasElement;
    canvas.addEventListener("mousedown", this.pressEventHandler);
  }

  private redraw() {
    const rows = this.rows;
    const columns = this.columns;
    const cellWidth = this.cellWidth;
    const cellHeight = this.cellHeight;
    const context = this.context;
    const workSitePosition = this.workSitePosition;

    const fontSize = cellHeight / 5;
    context.font = fontSize.toString() + "px " + this.font;
    context.textBaseline = 'middle';
    context.textAlign = 'center';

    context.beginPath();

    /// Worksite exist
    context.fillStyle = "#0000FF";
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < columns; col++) {
        if(workSitePosition[row][col] === WorkSiteField.LACK){
          continue;
        }
        this.context.fillRect(
          col * cellWidth,
          row * cellHeight,
          cellWidth,
          cellHeight,
        );
      }
    }

    /// Worksite not exist
    context.fillStyle = "#887711";
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < columns; col++) {
        if(workSitePosition[row][col] === WorkSiteField.FREE){
          continue;
        }
        this.context.fillRect(
          col * cellWidth,
          row * cellHeight,
          cellWidth,
          cellHeight,
        );
      }
    }

    context.fillStyle = "#000000";
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < columns; col++) {
        if(workSitePosition[row][col] === WorkSiteField.LACK){
          continue;
        }
        context.fillText(this.getIndex(col, row).toString(), col * cellWidth + cellWidth / 2, row * cellHeight + cellHeight / 2);
      }
    }

    this.context.stroke();
  }

  private getIndex(x: number, y: number): number{
    let indexCounter = 0;
    for (let row = 0; row <= y; row++) {
      for (let col = 0; col < this.columns; col++) {
        if( row === y && col === x){
          break;
        }
        if(this.workSitePosition[row][col] === WorkSiteField.FREE){
          ++indexCounter;
        }
      }
    }
    return indexCounter;
  }

  private pressEventHandler = (e: MouseEvent | TouchEvent) => {
    const canvas = (this.canvasRoomPlan.nativeElement as HTMLCanvasElement);
    const rect = canvas.getBoundingClientRect();

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const canvasLeft = ((e as MouseEvent).clientX - rect.left) * scaleX;
    const canvasTop = ((e as MouseEvent).clientY - rect.top) * scaleY;

    const row = Math.floor(canvasTop / this.cellHeight);
    const col = Math.floor(canvasLeft / this.cellWidth);
    
    switch(this.workSitePosition[row][col]){
      case WorkSiteField.FREE: 
        this.workSitePosition[row][col] = WorkSiteField.LACK;
        break;
      case WorkSiteField.LACK:
        this.workSitePosition[row][col] = WorkSiteField.FREE;
        break;
      }
      
    this.redraw();
  }
}
