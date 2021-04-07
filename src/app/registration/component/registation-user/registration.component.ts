import { Component, OnInit } from '@angular/core';
import { NgForm, FormControl, Validators, FormGroupDirective, FormGroup } from '@angular/forms';
import { ErrorStateMatcher} from '@angular/material/core';
import { RegistrationRequest } from '../../model/RegistrationRequest';
import { RegistrationService } from '../../service/registration.service';
import { MatDialog } from '@angular/material/dialog';
import { RegistrationInfoComponent } from '../registration-info/registration-info.component';

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

  emailFormControl = new FormControl('', [ Validators.required, Validators.email ])

  registrationFormGroup: FormGroup = new FormGroup({
    email: this.emailFormControl,
    firstName: new FormControl(),
    lastName: new FormControl(),
    password: new FormControl(),
    phoneNumber: new FormControl(),
    username: new FormControl()
  })

  matcher = new MyErrorStateMatcher();

  constructor( 
    private registrationService: RegistrationService,
    public dialog: MatDialog 
  ) { }

  ngOnInit(): void { }

  info = '';
  success: boolean = false;

  registrationRequest: RegistrationRequest;

  registrationUser(){
    this.registrationRequest = this.registrationFormGroup.value;
    this.registrationService.registerUser(this.registrationRequest)
      .subscribe(msg => {
        console.log(msg) // RegistrationResponse
        this.info = "Pomyślnie zarejestrowano";
        this.success = true;
      }, error => {
        console.log(error.message)
        this.info = 'Rejeestracja nie powiodła się';
        this.success = false;
      }
    );
    setTimeout(() => {this.openDialog();},
    1500);
  }

  openDialog(): void{
    const dialogRef = this.dialog.open(RegistrationInfoComponent, {data: {message:this.info, success:this.success},width: '250px'});
  }
  
}
