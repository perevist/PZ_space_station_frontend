import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  templateUrl: './registration-info.component.html',
  styleUrls: ['./registration-info.component.css']
})
export class RegistrationInfoComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<RegistrationInfoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  onOkClick(): void{
    this.dialogRef.close();
  }

  ngOnInit(): void {
  }


}
