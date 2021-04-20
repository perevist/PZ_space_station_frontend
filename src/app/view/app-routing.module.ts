import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { AddReservationComponent } from './reservation/component/add-reservation/add-reservation.component';
import { ReservationsTableComponent } from './reservation/component/reservations-table/reservations-table.component';
import { AuthGuard } from 'src/app/utility/auth.guard';

const routes: Routes = [
    
    /*{
        path: '',
        component: AppComponent,
        canActivate: [ AuthGuard ],
        data: { roles: ['user'] }
    },*/
    {
        path: 'reservations-table',
        component: ReservationsTableComponent,
        canActivate: [ AuthGuard ],
        data: { roles: ['user'] },
        children: [
            {
                path: 'add-reservation',
                component: AddReservationComponent,
                canActivate: [ AuthGuard ],
                data: { roles: ['user'] }
            }
        ]
    }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
