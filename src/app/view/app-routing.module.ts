import { NgModule } from '@angular/core';
import { MatTable } from '@angular/material/table';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { LoginInputComponent } from './login/component/login-input/login-input.component';
import { AddReservationComponent } from './reservation/component/add-reservation/add-reservation.component';
import { ReservationsTableComponent } from './reservation/component/reservations-table/reservations-table.component';
import { AuthGuard } from 'src/app/utility/auth.guard';
import { EditReservationComponent } from './reservation/component/edit-reservation/edit-reservation.component';

const routes: Routes = [
    {
        path: 'login-input',
        component: LoginInputComponent,
        canActivate: [AuthGuard],
        data: { roles: ['offline_access']}
    },
    {
        path: 'add-reservation',
        component: AddReservationComponent,
        canActivate: [ AuthGuard ],
        data: { roles: ['user', 'admin'] }
    },
    {
        path: 'reservations-table',
        component: ReservationsTableComponent,
        canActivate: [ AuthGuard ],
        data: { roles: ['user', 'admin'] },
    },
    {
        path: 'edit-reservation',
        component: EditReservationComponent,
        canActivate: [ AuthGuard ],
        data: { roles: ['user', 'admin']}
    }

        
    
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
