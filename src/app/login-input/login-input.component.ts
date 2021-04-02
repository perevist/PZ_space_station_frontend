import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login-input',
  templateUrl: './login-input.component.html',
  styleUrls: ['./login-input.component.css']
})
export class LoginInputComponent{
  passwordControl: FormGroup = new FormGroup({
    password: new FormControl('', [Validators.required, Validators.min(3)])
  })
  hide = true;
  constructor() { }

  loginValue = 'Enter login';
  passwordValue = 'Enter passoword';

}
