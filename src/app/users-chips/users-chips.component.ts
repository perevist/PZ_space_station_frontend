import { Component, OnInit } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';

export interface User{
  name: string;
}

@Component({
  selector: 'app-users-chips',
  templateUrl: './users-chips.component.html',
  styleUrls: ['./users-chips.component.css']
})
export class UsersChipsComponent implements OnInit {
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  users: User[];

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    if ((value || '').trim()) {
      this.users.push({name: value.trim()});
    }


    if (input) {
      input.value = '';
    }
  }
  
  remove(user: User): void {
    const index = this.users.indexOf(user);

    if (index >= 0) {
      this.users.splice(index, 1);
    }
  }


  constructor() { }

  ngOnInit(): void {
  }

}
