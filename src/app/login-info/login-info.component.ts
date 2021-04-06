import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LoginInputComponent } from '../login-input/login-input.component';
import { LoginInfoData } from '../model/LoginInfoData';

@Component({
  templateUrl: './login-info.component.html',
  styleUrls: ['./login-info.component.css']
})
export class LoginInfoComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<LoginInfoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  onOkClick(): void{
    this.dialogRef.close();
  }



  ngOnInit(): void {
  }

}


