import { Component, OnInit } from '@angular/core';
import { NgForm, FormControl, Validators, FormGroupDirective } from '@angular/forms';
import { ErrorStateMatcher} from '@angular/material/core';

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
  constructor() { }

  ngOnInit(): void {
  }

  emailValue = 'Email';
  firstNameValue = 'First name';
  lastNameValue = 'Last name';
  passwordValue = 'Password';
  phoneNumberValue = 'Phone number';
  usernameValue = 'Username';

}
