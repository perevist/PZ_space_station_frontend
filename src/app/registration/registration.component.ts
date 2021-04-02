import { Component, OnInit } from '@angular/core';
import { NgForm, FormControl, Validators, FormGroupDirective } from '@angular/forms';
import { ErrorStateMatcher} from '@angular/material/core';
// import { User } from 'src/app/user'
// import { RegistrationService } from '../registration.service';
// import { UserRegistrationData } from '../user';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})

export class RegistrationComponent implements OnInit {
  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ])

  matcher = new MyErrorStateMatcher();
  // constructor(private registrationService : RegistrationService) { }
  constructor() { }

  ngOnInit(): void {
  }

  emailValue = 'Email';
  firstNameValue = 'First name';
  lastNameValue = 'Last name';
  passwordValue = 'Password';
  phoneNumberValue = 'Phone number';
  usernameValue = 'Username';

  registrationUser(){
    // let user : UserRegistrationData;
    
    // user.email = this.emailValue,
    // user.firstName = this.firstNameValue,
    // user.lastName = this.lastNameValue,
    // user.password = this.passwordValue,
    // user.phoneNumber = this.phoneNumberValue,
    // user.username = this.usernameValue

    // let user2 : User;

    // this.registrationService.registerUser(user).subscribe( u => this.firstNameValue = u.id.toString()) // return user
  }
  

}
