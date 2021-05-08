import { Component, ChangeDetectionStrategy, ViewChild, AfterViewInit, ElementRef, Input } from '@angular/core';
import { Coordinates } from 'src/app/view/model/Coordinates';
import { WorksiteRequestDto } from 'src/app/view/model/WorksiteRequestDto';


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
  private isEditable: boolean;
  
  public isEditReservation: boolean = false;
  public isOneChoosenInEditReservation: boolean = false;

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
  }

  public reline(columns: number, rows: number): void {
    const canvas = this.canvasRoomPlan.nativeElement as HTMLCanvasElement;

    this.columns = columns;
    this.rows = rows;

    if(columns <= 0 || rows <= 0){
      this.cellHeight = canvas.height;
      this.cellWidth = canvas.width;
      this.isEmpty();
      return;
    }
    else{
      this.isEditable = true;
    }

    let WorkSiteFieldFill: WorkSiteField = this.modeReservation ? WorkSiteField.LACK : WorkSiteField.FREE;

    const workSitePosition = new Array(rows)
    .fill(undefined)
    .map(() => new Array(columns)
    .fill(WorkSiteFieldFill));
    

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

  public getWorkSitesAsCoordinates(): [[number, number]]{
    const rows = this.rows;
    const columns = this.columns;
    const workSitePosition = this.workSitePosition;

    let worksites: [[number, number]];

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < columns; col++) {
        if(workSitePosition[row][col] !== WorkSiteField.LACK){
          worksites.push([col, row]);
        }
      }
    }

    return worksites;
  }

  public getWorkSites(): Array<WorksiteRequestDto>{
    const rows = this.rows;
    const columns = this.columns;
    const workSitePosition = this.workSitePosition;

    let worksites: WorksiteRequestDto[] = [];

    console.log(worksites);

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < columns; col++) {
        if(workSitePosition[row][col] !== WorkSiteField.LACK){
          // we should add 1 to columns and rows becouse some genius started indexing from one in the DB
          worksites.push({ coordinates: {x: col + 1, y: row + 1}, worksiteInRoomId: this.getIndex(col, row)});
        }
      }
    }
    return worksites;
  }

  public getChosenWorkSites(): [number, number][]{
    const rows = this.rows;
    const columns = this.columns;
    const workSitePosition = this.workSitePosition;

    let worksites: [number, number][] = [];

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

  public setReserved(positions: Coordinates[]): void{
    const workSitePosition = this.workSitePosition;
    console.log(positions);
    positions.forEach(pos => {
      workSitePosition[pos.y - 1][pos.x - 1] = WorkSiteField.RESERVED;
    });
      this.redraw();
  }

  public setFree(positions: Coordinates[]): void{
    const workSitePosition = this.workSitePosition;
    console.log(positions);
    if(this.rows !== 0 && this.columns !== 0){
        positions.forEach(pos => {
            workSitePosition[pos.y - 1][pos.x - 1] = WorkSiteField.FREE;
        });
        this.workSitePosition = workSitePosition;
        this.redraw();
    }
  }

  public setChosen(position: Coordinates): void{
      if(this.rows !== 0 && this.columns !== 0){
        this.workSitePosition[position.y - 1][position.x - 1] = WorkSiteField.CHOSEN;
        this.redraw();
      }
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

    const row = Math.floor(canvasTop / (this.cellHeight + 1));
    const col = Math.floor(canvasLeft / (this.cellWidth+ 1));
    
    switch(this.workSitePosition[row][col]){
      case WorkSiteField.FREE:
        if( this.modeReservation ){
            if(this.isEditReservation && this.getChosenWorkSites().length === 1){
                this.isOneChoosenInEditReservation = true;
            } else{
                this.workSitePosition[row][col] = WorkSiteField.CHOSEN; 
                
            }
        }
        else{
          this.workSitePosition[row][col] = WorkSiteField.LACK;
          --this.WorkSitesNumber; 
        }
        break;
      case WorkSiteField.CHOSEN:
        this.workSitePosition[row][col] = WorkSiteField.FREE;
        if(this.isEditReservation){
            this.isOneChoosenInEditReservation = false;
        }
        break;
      case WorkSiteField.LACK:
        if(!this.modeReservation){
          this.workSitePosition[row][col] = WorkSiteField.FREE;
          ++this.WorkSitesNumber;
        }
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

