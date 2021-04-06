import { Component } from '@angular/core';

export var logged: boolean = false;
export var firstName: string;
export var lastName: string;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'SpaceStation-frontend';

}
