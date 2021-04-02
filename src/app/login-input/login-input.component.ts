import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm, FormControl, FormGroup, Validators } from '@angular/forms';
import { LoginRequest } from '../model/LoginRequest';
import { AuthenticationService } from '../service/authentication.service';

@Component({
    selector: 'app-login-input',
    templateUrl: './login-input.component.html',
    styleUrls: ['./login-input.component.css']
})

export class LoginInputComponent{
    constructor(private authService: AuthenticationService) {}
    
    loginControl: FormGroup = new FormGroup({
        username: new FormControl('', [Validators.required, Validators.min(3)]),
        password: new FormControl('', [Validators.required, Validators.min(3)])
    })
    
    loginValue = 'Enter login';
    passwordValue = 'Enter passoword';

    hide = true;

    loginRequest: LoginRequest;

    ngOnInit(): void {}

    onSubmit() {
        this.loginRequest = this.loginControl.value;
        this.authService.loginUser(this.loginRequest)
        .subscribe(msg => {
          console.log(msg.message)
        }, error => {
          console.log(error.message)
        });
    }
}
