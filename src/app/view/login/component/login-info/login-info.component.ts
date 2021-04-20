import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

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


