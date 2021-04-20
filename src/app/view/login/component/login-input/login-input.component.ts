import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LoginInfoComponent } from '../login-info/login-info.component';
import { LoginRequest } from '../../model/LoginRequest';
import { AuthenticationService } from '../../service/authentication.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login-input',
  templateUrl: './login-input.component.html',
  styleUrls: ['./login-input.component.css']
})

export class LoginInputComponent{
  constructor(
    private authService: AuthenticationService,
    public dialog: MatDialog
  ) { }

  loginControl: FormGroup = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.min(3)]),
    password: new FormControl('', [Validators.required, Validators.min(3)])
  });

  info: string;
  success: boolean;
  hide = true;

  loginRequest: LoginRequest;

  // tslint:disable-next-line:use-lifecycle-interface
  ngOnInit(): void {}

  // tslint:disable-next-line:typedef
  onSubmit() {
    this.loginRequest = this.loginControl.value;
    this.authService.loginUser(this.loginRequest)
      .subscribe(msg => {
        console.log(msg.message);
        this.info = "Pomyślnie zalogowano";
        this.success = true;
      }, error => {
        console.log(error.message);
        this.info = "Nie udało się zalogować";
        this.success = false;
      });
    setTimeout( () => { this.openDialog(); }, 1000);
  }

  openDialog(): void{
    const dialogRef = this.dialog.open( LoginInfoComponent, { data:{ message:this.info, success:this.success }, width: '250px' });
  }
}
