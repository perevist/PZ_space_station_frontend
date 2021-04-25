import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/utility/auth.guard';
import { AddRoomComponent } from './component/add-room/add-room.component';

const routes: Routes = [
  {
    path: 'room',
    children: [
      { 
        path: 'add',
        component: AddRoomComponent,
        data: {
          roles: ['admin']
        },
        canActivate: [AuthGuard] 
      }
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RoomRoutingModule { }