import { Component, ChangeDetectionStrategy, ViewChild, AfterViewInit, ElementRef, Input } from '@angular/core';


enum WorkSiteField{
  FREE,
  CHOSEN,
  RESERVED,
  LACK
}

@Component({
  selector: 'app-room-plan',
  template: `<canvas #canvasRoomPlan height="{{height}}" width="{{width}}"> </canvas>`,
  styleUrls: ['./room-plan.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RoomPlanComponent implements AfterViewInit{
  readonly WrokSiteFreeColor = "#1488E0";
  readonly WrokSiteChosenColor = "#14FFE0";
  readonly WrokSiteReservedColor = "#DD0031";
  readonly WrokSiteLackColor = "#000000";
  
  private ColorGrid: string;
  private ColorFont: string;

  @ViewChild('canvasRoomPlan') canvasRoomPlan: ElementRef;
  
  @Input() height: string = "400";
  @Input() width: string = "400";
  @Input() color: string = "#FFFFFF";
  @Input() colorGrid: string = "#000000";
  @Input() modeReservation: boolean = false;
  
  /** Canvas 2d context */
  private context: CanvasRenderingContext2D;
  private workSitePosition: WorkSiteField[][];
  private isReservation: boolean;
  private isEditable: boolean;

  private WorkSitesNumber: number;
  private cellHeight: number;
  private cellWidth: number;
  private columns: number;
  private rows: number;
  private readonly font: string = "Arial";

  constructor() {
    this.isEditable = true;    
  }

  ngAfterViewInit() {
    const canvas = this.canvasRoomPlan.nativeElement as HTMLCanvasElement;    

    this.context = canvas.getContext('2d');

    this.ColorFont = this.color;
    this.ColorGrid = this.colorGrid;

    this.reline(0, 0);
    this.createUserEvents();
    this.isReservation = this.modeReservation;
  }

  public reline(columns: number, rows: number): void {
    const canvas = this.canvasRoomPlan.nativeElement as HTMLCanvasElement;

    this.columns = columns;
    this.rows = rows;

    if(columns === 0 || rows === 0){
      this.cellHeight = canvas.height;
      this.cellWidth = canvas.width;
      this.isEmpty();
      return;
    }
    else{
      this.isEditable = true;
    }

    const workSitePosition = new Array(rows)
    .fill(undefined)
    .map(() => new Array(columns)
    .fill(WorkSiteField.FREE));
    console.log(workSitePosition);
    

    this.cellHeight = (canvas.height-1) / rows - 1;
    this.cellWidth = (canvas.width-1) / columns - 1;

    this.workSitePosition = workSitePosition;
    this.WorkSitesNumber = columns * rows;

    this.redraw();
  }

  public getDimensions(): [number, number]{
    return [this.columns, this.rows];
  }

  public getWorkSitesListSize(): number{
    return this.WorkSitesNumber;
  }

  public getWorkSites(): [number, number]{
    const rows = this.rows;
    const columns = this.columns;
    const workSitePosition = this.workSitePosition;

    let worksites: [number, number];

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < columns; col++) {
        if(workSitePosition[row][col] !== WorkSiteField.LACK){
          worksites.push(col, row);
        }
      }
    }

    return worksites;
  }

  public getChosenWorkSites(): [[number, number]]{
    const rows = this.rows;
    const columns = this.columns;
    const workSitePosition = this.workSitePosition;

    let worksites: [[number, number]] = [[-1, -1]];
    worksites.pop();

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < columns; col++) {
        if(workSitePosition[row][col] === WorkSiteField.CHOSEN){
          worksites.push([col, row]);
        }
      }
    }
    return worksites;
  }

  public setReservedAll(): void{
    const workSitePosition = new Array(this.rows)
    .fill(undefined)
    .map(() => new Array(this.columns)
    .fill(WorkSiteField.RESERVED));

    this.workSitePosition = workSitePosition;
  }

  public setReserved(positions: [number, number]): void{
    const workSitePosition = this.workSitePosition;
      workSitePosition[positions[1]][positions[0]] = WorkSiteField.RESERVED;
      this.redraw();
  }

  public setFree(positions: [[number, number]]): void{
    const workSitePosition = this.workSitePosition;
    positions.forEach(pos => {
        console.log(pos);
        workSitePosition[pos[1]][pos[0]] = WorkSiteField.FREE;
        console.log(workSitePosition[pos[1]][pos[0]]);
    });
    this.workSitePosition = workSitePosition;
    this.redraw();
    console.log(this.workSitePosition);
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
    context.fillStyle = this.WrokSiteFreeColor;
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < columns; col++) {
        if(workSitePosition[row][col] !== WorkSiteField.FREE){
          continue;
        }
        this.context.fillRect(
          col * (cellWidth + 1) + 1,
          row * (cellHeight + 1) + 1,
          cellWidth,
          cellHeight,
        );
      }
    }

    context.fillStyle = this.WrokSiteChosenColor;
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < columns; col++) {
        if(workSitePosition[row][col] !== WorkSiteField.CHOSEN){
          continue;
        }
        this.context.fillRect(
          col * (cellWidth + 1) + 1,
          row * (cellHeight + 1) + 1,
          cellWidth,
          cellHeight,
        );
      }
    }

    /// Worksite reserved
    context.fillStyle = this.WrokSiteReservedColor;
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < columns; col++) {
        if(workSitePosition[row][col] !== WorkSiteField.RESERVED){
          continue;
        }
        this.context.fillRect(
          col * (cellWidth + 1) + 1,
          row * (cellHeight + 1) + 1,
          cellWidth,
          cellHeight,
        );
      }
    }

    /// Worksite not exist
    context.fillStyle = this.WrokSiteLackColor;
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < columns; col++) {
        if(workSitePosition[row][col] !== WorkSiteField.LACK){
          continue;
        }
        this.context.fillRect(
          col * (cellWidth + 1) + 1,
          row * (cellHeight + 1) + 1,
          cellWidth,
          cellHeight,
        );
      }
    }

    context.fillStyle = this.ColorFont;
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < columns; col++) {
        if(workSitePosition[row][col] === WorkSiteField.LACK){
          continue;
        }
        context.fillText(this.getIndex(col, row).toString(), col * (cellWidth+1) + cellWidth / 2, row * (cellHeight+1) + cellHeight / 2);
      }
    }

    this.context.stroke();
    this.redrawGrid();
  }

  private redrawGrid(): void{
    const ctx = this.context;
    ctx.beginPath();
    ctx.strokeStyle = this.ColorGrid;

    // Vertical lines.
    for (let i = 0; i <= this.columns; i++) {
        ctx.moveTo(i * (this.cellWidth + 1) + 1, 0);
        ctx.lineTo(i * (this.cellWidth + 1) + 1, (this.cellHeight + 1) * this.rows + 1);
    }

    // Horizontal lines.
    for (let j = 0; j <= this.rows; j++) {
        ctx.moveTo(0,                           j * (this.cellHeight + 1) + 1);
        ctx.lineTo((this.cellWidth + 1) * this.columns + 1, j * (this.cellHeight + 1) + 1);
    }

    ctx.stroke();
  }

  private getIndex(x: number, y: number): number{
    let indexCounter = 0;
    for (let row = 0; row <= y; row++) {
      for (let col = 0; col < this.columns; col++) {
        if( row === y && col === x){
          break;
        }
        if(this.workSitePosition[row][col] !== WorkSiteField.LACK){
          ++indexCounter;
        }
      }
    }
    return indexCounter + 1;
  }

  private pressEventHandler = (e: MouseEvent | TouchEvent) => {
    if( !this.isEditable ){
      return;
    }
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
        if( this.isReservation ){
          this.workSitePosition[row][col] = WorkSiteField.CHOSEN; 
        }
        else{
          this.workSitePosition[row][col] = WorkSiteField.LACK;
          --this.WorkSitesNumber; 
        }
        break;
      case WorkSiteField.CHOSEN:
        this.workSitePosition[row][col] = WorkSiteField.FREE;
        break;
      case WorkSiteField.LACK:
        this.workSitePosition[row][col] = WorkSiteField.FREE;
        ++this.WorkSitesNumber; 
        break;
      }
      
    this.redraw();
  }

  private isEmpty(): void {
    const cellWidth = this.cellWidth;
    const cellHeight = this.cellHeight;
    const context = this.context;

    const fontSize = cellHeight / 6;
    context.font = fontSize.toString() + "px " + this.font;
    context.textBaseline = 'middle';
    context.textAlign = 'center';

    context.beginPath();

    context.fillStyle = this.WrokSiteLackColor;
    context.fillRect( 0, 0, cellWidth, cellHeight );
    context.fillStyle = this.ColorFont;
    context.fillText("Plan pokoju", cellWidth / 2, cellHeight / 2);
    
    context.stroke();
    this.isEditable = false;
  }  
}

