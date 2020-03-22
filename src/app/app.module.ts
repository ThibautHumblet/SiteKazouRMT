import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {CardModule} from 'primeng/card'; 
import {ButtonModule} from 'primeng/button';
import {AccordionModule} from 'primeng/accordion';
import {TabViewModule} from 'primeng/tabview';

import { AppRoutingModule } from './app-routing.module';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { Button } from 'protractor';
import { HeaderComponent } from './header/header.component';
import { IndexComponent } from './index/index.component';
import { FooterComponent } from './footer/footer.component';
import { OpenPlaatsenComponent } from './open-plaatsen/open-plaatsen.component';
import { CalendarComponent } from './calendar/calendar.component';
import { OscarsComponent } from './oscars/oscars.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    IndexComponent,
    FooterComponent,
    OpenPlaatsenComponent,
    CalendarComponent,
    OscarsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    CardModule,
    ButtonModule,
    AccordionModule,
    TabViewModule,
    RouterModule.forRoot([
    ], {useHash: true})
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
