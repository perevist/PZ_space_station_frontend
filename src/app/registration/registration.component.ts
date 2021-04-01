import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/user'
import { RegistrationService } from '../registration.service';
import { UserRegistrationData } from '../user-registration-data';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

  constructor(private registrationService : RegistrationService) { }

  ngOnInit(): void {
  }

  emailValue = 'Email';
  firstNameValue = 'First name';
  lastNameValue = 'Last name';
  passwordValue = 'Password';
  phoneNumberValue = 'Phone number';
  usernameValue = 'Username';

  registrationUser(){
    let user : UserRegistrationData;
    
    user.email = this.emailValue,
    user.firstName = this.firstNameValue,
    user.lastName = this.lastNameValue,
    user.password = this.passwordValue,
    user.phoneNumber = this.phoneNumberValue,
    user.username = this.usernameValue

    let user2 : User;
  

    this.registrationService.registerUser(user).subscribe( u => this.firstNameValue = u.id.toString()) // return user
  }
  

}
