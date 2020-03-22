import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IndexComponent } from './index/index.component';
import { flush } from '@angular/core/testing';
import { OpenPlaatsenComponent } from './open-plaatsen/open-plaatsen.component';
import { CalendarComponent } from './calendar/calendar.component';
import { OscarsComponent } from './oscars/oscars.component';


const routes: Routes = [
  { 
    path: 'index',
    component: IndexComponent
  },
  {
    path: '',
    redirectTo: '/index',
    pathMatch: 'full'
  },
  {
    path:'open-plaatsen',
    component: OpenPlaatsenComponent
  },
  {
    path:'calendar',
    component: CalendarComponent
  },
  {
    path:'oscars',
    component: OscarsComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
