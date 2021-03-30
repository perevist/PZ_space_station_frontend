import { Component } from '@angular/core';

@Component({
  selector: 'app-login-input',
  templateUrl: './login-input.component.html',
  styleUrls: ['./login-input.component.css']
})
export class LoginInputComponent {
  hide = true;
  constructor() { }

  loginValue = 'Enter login';
  passwordValue = 'Enter passoword';

}
